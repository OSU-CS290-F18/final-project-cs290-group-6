<<<<<<< HEAD
//**************************************
//Functions to Interact with Server
//**************************************
function loadResourcesFromServer(callback) {
    const xhreq = new XMLHttpRequest();
    xhreq.onreadystatechange = function () {
        if (this.readyState !== 4 || this.status !== 200) {
            return;
        }
        console.log(this);
        const responseData = JSON.parse(this.responseText);
        callback(responseData);
    };

    xhreq.open("GET", "resources");
    xhreq.send();
    console.log('LOAD CALLED');
}


function update(responseData) {
    // document.body.innerText = JSON.stringify(responseData);
    allData = responseData;
    console.log(allData);
}

var allData;
loadResourcesFromServer(update);


=======
>>>>>>> 3308972256cbc432d6048edbcdb0d097dcd8ea17

//**************************************
//Functions to Read User Input
//**************************************
function getSearchBy(){
    var result = [];
    var criteria = document.querySelectorAll('#filter-searchtype input');
    criteria.forEach(function (elem){
        if(elem.checked){
            result.push(elem.id);
        }
    })
    if(result.length === 0){
        result.push('title');
        result.push('sem');
    }
    return result;
}

function getFilters(){
    var categories = document.querySelectorAll('#filter-toggles input');
    var result = [];
    categories.forEach(function (elem){
        if(elem.checked){
            result.push(elem.id);
        }
    })
    return result;
}

//**************************************
//Functions to Filter Resource Data
//**************************************

function filterByText(courses_arr, queryText){
    var fields_to_search = getSearchBy();
    if(queryText){
        queryText = queryText.toLowerCase().trim().split(" ");//convert to lowercase, split query into words on spaces
        var keep = [];
        courses_arr.forEach(function (course){
            fields_to_search.forEach(function (field){
                queryText.forEach(function (word){
                    if(course[field]){
                        var course_field = course[field].toLowerCase(); 
                        if(course_field.includes(word) && !(keep.includes(course))){
                            keep.push(course);
                        }
                    }
                    else{
                        console.log('COURSE OBJ MISSING FIELD '+ field.toUpperCase())
                    }
                })
            })
        })
        return keep;
    }
    return courses_arr;
}

function filterByCategory(courses_arr){
    var categories = getFilters();
    categories.forEach(function (cat){
        courses_arr = courses_arr.filter(function (course){
            if(course[cat]){
                return course;
            }
        }); 
    })
    return courses_arr;
}

function search(queryText){
    var courses_to_display = [];
    for(source in allData){
        allData[source]['departments'].forEach(function (dep){
            var temp_courses = filterByCategory(dep['courses']);
            temp_courses = filterByText(temp_courses, queryText);
            courses_to_display = courses_to_display.concat(temp_courses);
        })
    }
    return courses_to_display;
}

//**************************************
//Functions to Display Results
//**************************************

function displayCourse(course){
    var courseHTML = Handlebars.templates.courseResult(course);
    var resultsContainer = document.getElementById('all-results-container');
    resultsContainer.insertAdjacentHTML('beforeend', courseHTML);
}

function clearResults(){
    var resultsContainer = document.getElementById('all-results-container');
    while(resultsContainer.hasChildNodes()){
        resultsContainer.removeChild(resultsContainer.firstChild);
    }
}

function searchListener(){
    var params = (new URL(document.location)).searchParams;//check for param from basic search
    var queryText = params.get('search');
    if(!queryText){
        queryText = document.getElementById('adv-search-text').value//if not basic search, check advanced search query
    }
    clearResults();//clear current results
    var res = search(queryText);//search the data for applicable courses
    res.forEach(function (elem){
        displayCourse(elem);
    })
}



//**************************************
//Functions to Interact with Server
//**************************************
function loadResourcesFromServer(callback) {
    const xhreq = new XMLHttpRequest();
    xhreq.onreadystatechange = function () {
        if (this.readyState !== 4 || this.status !== 200) {
            return;
        }
        console.log(this);
        const responseData = JSON.parse(this.responseText);
        callback(responseData);
    };

    xhreq.open("GET", "resources");
    xhreq.send();
}


function update(responseData) {
    allData = responseData;
    searchListener();//load all the data on initial request
}

//**************************************
//Attatch Event Listeners and instantiate page
//**************************************
var basicSearchBtn = document.getElementById('search-button');
var basicSearchText;
if(basicSearchBtn){
    basicSearchBtn.addEventListener('click', function (event){
        basicSearchText = document.getElementById("search-text").value;
        window.location.href = "./advancedSearch.html?search="+basicSearchText;
    });
}

var advSearchBtn = document.getElementById('adv-search-button');
advSearchBtn.addEventListener('click', searchListener);

var allData;
loadResourcesFromServer(update);

