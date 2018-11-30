
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
if(searchBtn){
    searchBtn.addEventListener('click', function (event){
        console.log('Button was clicked.')
        var textQuery = document.getElementById("search-text").textContent;
        var filters = {
            'title': true, 
            'semester': true,
            'categories': [], 
        };
        window.location.href = "./advancedSearch.html";
    });
}


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
    console.log(result);
    return result;
}


function filterByText(courses_arr){
    var fields_to_search = getSearchBy();
    var queryText = document.getElementById('adv-search-text').value.toLowerCase();
    if(queryText){
        queryText = queryText.trim().split(" ");
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

//****************************************/

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
//****************************************/

function test(){
    var dep_name = allData['mit']['departments'][12]['name']
    var courses = allData['mit']['departments'][12]['courses'];
    console.log("BEFORE FILTER: ",dep_name, courses);
    // courses = filterByCategory(courses);
    courses = filterByText(courses);
    console.log("AFTER FILTER: ", dep_name, courses);
}


var body = document.querySelector('body');
body.addEventListener('click', test);
