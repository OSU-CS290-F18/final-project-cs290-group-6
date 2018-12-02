const https = require("https");
const cheerio = require("cheerio");

const csCourses = [];
let courseCount = 0;
const regex0 = /(?:a href=")([a-zA-z0-9\:\/\.\-\#]+(?="))(?:.+>)(\d\d-\d\d\d(?=<\/a>))(?:.+\n.+">)(.+(?=<\/a>))/;
const regex1 = /(?:>)(\d\d\-\d\d\d)(?:.+\n.+a href=")(.+)(?:" title=")(.+)(?=")/;
const regex2 = /https?/;
const cmuCSCourseURL = "https://www.csd.cs.cmu.edu/course-profiles/csd-course-list";
const courseBaseURL= "https://csd.cs.cmu.edu";

function getCourses()	
{
	let parsingArray = [];
	let courseListPromise = new Promise((resolve, reject) => 
	https.get(cmuCSCourseURL, res =>
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
			const $ = cheerio.load(rawData);

			$("tr", "tbody").each(function(i, elem)
			{
				const elemDat = $(this).html();
				let parsed = regex0.exec(elemDat);
				if(parsed)
				{
					parsingArray.push(investigateCourse({title: parsed[3], courseCode: parsed[2], courseURL: parsed[1]}));
				}
				else
				{
					parsed = null;
					parsed = regex1.exec(elemDat);
					if(parsed)
					{
						parsingArray.push(investigateCourse({title: parsed[3], courseCode: parsed[1], courseURL: parsed[2]}));
					}
				}
			});
			resolve(Promise.all(parsingArray));
		});
	})).then(data =>
	{
		console.log(parsingArray);
//		console.log("csCourses: ", csCourses);
	}).catch((reason) =>
	{
		console.log("getCourses rejected:", reason);
	});
}

function investigateCourse(course)
{
	let result = false;
	if(!regex2.test(course.courseURL))
	{
		course.courseURL = courseBaseURL + course.courseURL;
	}
	else
	{
		course.courseURL = course.courseURL.replace(regex2, "https");
	}

	return new Promise((resolve, reject) => 
		https.get(course.courseURL, res =>
		{
			if(res.statusCode == 301)
			{
				reject(res);
			}
			else if(res.statusCode != 200)
			{
				reject(new Error(res.statusMessage));
			}
			let rawData = "";
			res.on("data", (chunk) => {
				rawData += chunk;
			});
			res.on("end", () =>
			{
				result = true;
				const page = cheerio.load(rawData);
				course.courseURL = page("strong:contains('Course Website:')").next().text();
				resolve(course);
			});
		})
	).then(data =>
	{
//		console.log("course:", course);
//		console.log("resolved Course: ", course);
	}).catch((reason) =>
	{
		if(reason.statusCode == 301)
		{
			course.courseURL = reason.headers.location;
			investigateCourse(course);
		}
		else
		{
			console.log("Promise in 'investigateCourse' rejected:", reason.statusMessage);
		}
	});
}

getCourses();
