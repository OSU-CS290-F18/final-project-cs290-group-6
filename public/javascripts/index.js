function loadResourcesFromServer(callback) {
    const xhreq = new XMLHttpRequest();
    xhreq.onreadystatechange = function () {
        if (this.readyState !== 4 || this.status !== 200) {
            return;
        }

        const responseData = JSON.parse(this.responseText);
        callback(responseData);
    };

    xhreq.open("GET", "resources");
    xhreq.send();
}


function update(responseData) {
    document.body.innerText = JSON.stringify(responseData);
    console.log(responseData);
}

loadResourcesFromServer(update);