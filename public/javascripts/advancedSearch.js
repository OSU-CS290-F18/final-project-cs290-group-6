
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



//function getFilters


 // var filters = {
    //     'title': 
    //     'semester':
    //     'audio':
    //     'video':
    //     'notes':
    //     'textbook':
    //     'exam':
    // };