const https = require("https");
const cheerio = require("cheerio");

const csCourses = {};
let courseCount = 0;
const regex0 = /(?:a href=")([a-zA-z0-9\:\/\.\-\#]+(?="))(?:.+>)(\d\d-\d\d\d(?=<\/a>))(?:.+\n.+">)(.+(?=<\/a>))/;
const regex1 = /(?:>)(\d\d\-\d\d\d)(?:.+\n.+a href=")(.+)(?:" title=")(.+)(?=")/;
const regex2 = /https?/;
const cmuCSCourseURL = "https://www.csd.cs.cmu.edu/course-profiles/csd-course-list";
const courseBaseURL= "https://csd.cs.cmu.edu";

function getCourses()	
{
	return new Promise((resolve, reject) => https.get(cmuCSCourseURL, res =>
	{
		if(res.statusCode != 200)
		{
			reject(new Error(res.statusMessage));
		}
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
		const $ = cheerio.load(rawData);

		$("tr", "tbody").each(function(i, elem)
		{
			const elemDat = $(this).html();
			let parsed = regex0.exec(elemDat);
			if(parsed)
			{
				csCourses[courseCount] = {title: parsed[3], courseCode: parsed[2], courseURL: parsed[1]};
				parseCourseUrl(csCourses[courseCount]);
				courseCount++;
			}
			else
			{
				parsed = null;
				parsed = regex1.exec(elemDat);
				if(parsed)
				{
					csCourses[courseCount] = {title: parsed[3], courseCode: parsed[1], courseURL: parsed[2]};
					parseCourseUrl(csCourses[courseCount]);
					courseCount++;
				}
			}
		});
	}).catch((reason) =>
	{
		console.log("getCourses rejected:", reason);
	});
}
//		console.log("csCourses", csCourses);

function parseCourseUrl(course)
{
	if(!regex2.test(course.courseURL))
	{
		course.courseURL = courseBaseURL + course.courseURL;
	}
	else
	{
		course.courseURL = course.courseURL.replace(regex2, "https");
	}

	return new Promise((resolve, reject) => https.get(course.courseURL, res =>
	{
		if(res.statusCode != 200)
		{
			console.log("== ",course.title," url invalid", course.courseURL);
			reject(new Error(res.statusMessage));
		}
		let rawData = "";
		res.on("data", (chunk) => {
			rawData += chunk;
		});
		res.on("end", () =>
		{
			resolve(rawData);
		});
	})).then((rawData) =>
		{
			const page = cheerio.load(rawData);
			console.log("page:", page("strong:contains('Course Website:')").next().text());
		}).catch((reason) =>
		{
			console.log("getCourses promise rejected:", reason.toString());
		});
}

function redirectError(response, message, fileName, lineNumber)
{
	var instance = new Error(message, fileName, lineNumber);
	instance.response = response;
	Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
	if(Error.captureStackTrace)
	{
		Error.captureStackTrace(instance, redirectError);
	}
	return instance;
}

getCourses();

