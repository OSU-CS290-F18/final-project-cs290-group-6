const https = require("https");

/**
 * Delete properties that will not be used in the app
 * @param courses
 */
function deleteIrrelevantProperties(courses) {
    Object.keys(courses).forEach(key => {
        const course = courses[key];
        delete course.sort_as;
        delete course.simulations;
        delete course.instructorInsights;
        delete course.projectWithExmp;
        delete course.otherAudio;
        delete course.otherVideo;
    });
}

function resultsForDepartment(department, title) {
    return new Promise((resolve, reject) => https.get(`https://ocw.mit.edu/courses/${department}/index.json`, res => {
        if (res.statusCode !== 200) {
            reject(new Error(res.statusMessage));
        }

        let rawData = "";
        res.on("data", chunk => rawData += chunk);
        res.on("end", () => {
            resolve(JSON.parse(rawData));
        });
    })).then(courses => {
        deleteIrrelevantProperties(courses);
        const department = {
            name: title,
            courses: courses
        };
        console.log("Fetched " + department.name);
        return department;
    }).catch(_ => console.log(`ERROR: Encounter error while requesting for (${department})`));
}

function resultsForAllDepartments() {
    return new Promise((resolve, reject) => https.get("https://ocw.mit.edu/courses/find-by-number/departments.json", res => {
        if (res.statusCode !== 200) {
            reject(new Error(res.statusMessage));
        }

        let rawData = "";
        res.on("data", chunk => rawData += chunk);
        res.on("end", () => {
            resolve(JSON.parse(rawData));
        });
    })).then(departments => {// remove .slice(n,k) to get all departments <===
        const requests = departments.map(department => {
            return resultsForDepartment(department.id, department.title);
        });
        return Promise.all(requests);
    }).then(results => {
        const returnObject = {
            domain: "MIT",
            departments: results
        };
        console.log("Fetched all departments");
        return returnObject;
    }).catch(_ => console.log("Encounter error while requesting for all departments"));
}

function results() {
    return resultsForAllDepartments();
}

module.exports.name = "mit";
module.exports.results = results;
