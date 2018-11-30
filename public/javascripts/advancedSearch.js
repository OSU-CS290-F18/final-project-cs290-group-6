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

//index search button listener
var searchBtn = document.getElementById('search-button');
var basicSearchText;
if(searchBtn){
    searchBtn.addEventListener('click', function (event){
        console.log('Button was clicked.')
        basicSearchText = document.getElementById("search-text").textContent;
        window.location.href = "./advancedSearch.html";
    });
}

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
//Functions to Filter Main Data
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

function test(){
    clearResults();
    var res;
    res = search(document.getElementById('adv-search-text').value);
    res.forEach(function (elem){
        displayCourse(elem);
    })
}

var body = document.querySelector('body');
body.addEventListener('click', test);
