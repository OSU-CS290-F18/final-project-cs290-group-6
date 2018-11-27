const https = require("https");
const allCourses = {};

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

function resultsForAllDepartments() {
    return new Promise((resolve, reject) => https.get("https://ocw.mit.edu/courses/find-by-number/departments.json", res => {
        if (res.statusCode !== 200) {
            reject(new Error(res.statusMessage));
        }

        let rawData = "";
        res.on("data", chunk => rawData += chunk);
        res.on("end", () => {
            resolve(rawData);
        });
    })).then(rawData => { //--- ===> remove .slice(n,k) to get all departments <===
        const requests = JSON.parse(rawData).slice(0,2).map(department => {
            return resultsForDepartment(department.id, department.title);
        });
        return Promise.all(requests).then(_ => allCourses);
    }).catch(_ => console.log("Encounter error while requesting for all departments"));
}

function resultsForDepartment(department, title) {
    return new Promise((resolve, reject) => https.get(`https://ocw.mit.edu/courses/${department}/index.json`, res => {
        if (res.statusCode !== 200) {
            reject(new Error(res.statusMessage));
        }

        let rawData = "";
        res.on("data", chunk => rawData += chunk);
        res.on("end", () => {
            resolve(rawData);
        });
    })).then(rawData => {
        const courses = JSON.parse(rawData);
        deleteIrrelevantProperties(courses);

        return allCourses[title] = courses;
    }).catch(_ => console.log(`ERROR: Encounter error while requesting for (${department})`));
}

function results() {
    return resultsForAllDepartments();
}

module.exports.name = "mit";
module.exports.results = results;