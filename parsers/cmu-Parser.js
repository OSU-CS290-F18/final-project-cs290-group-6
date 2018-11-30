const https = require("https");
const csCourses = {};
const cheerio = require("cheerio");

const cmuCSCourseURL = "https://www.csd.cs.cmu.edu/course-profiles/csd-course-list";

function getCourses()	
{
	return new Promise((resolve, reject) => https.get(cmuCSCourseURL, res =>
	{
		if(res.statusCode != 200)
		{
			reject(new Error(res.statusMessage));
		}
		console.log("res.statusCode:", res.statusCode);
		console.log("res.headers:", res.headers);

//		var regex = /(?=<tr>)[^]*(?=<\/tr>)/g;
		let rawData = "";
		res.on("data", (chunk) => {
			rawData += chunk;
		});
		res.on("end", () =>
		{
			resolve(rawData);
		});
	})).then(rawData =>
	{
		console.log("")
		var $ = cheerio.load(rawData);
	});
}


getCourses();
