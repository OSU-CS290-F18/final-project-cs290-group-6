const https = require("https");
const cheerio = require("cheerio");

const cmuCSCourseURL = "https://www.csd.cs.cmu.edu/course-profiles/csd-course-list";
const courseBaseURL= "https://csd.cs.cmu.edu";
const regex = [
	/(?:a href=")([a-zA-z0-9\:\/\.\-\#]+(?="))(?:.+>)(\d\d-\d\d\d(?=<\/a>))(?:.+\n.+">)(.+(?=<\/a>))(?:.+\n.+">)(\w)(\d\d)/,
	/(?:>)(\d\d\-\d\d\d)(?:.+\n.+a href=")(.+)(?:" title=")(.+)(?=")/,
	/https?/
	];

function getCScourses()	
{
	return new Promise((resolve, reject) => 
	https.get(cmuCSCourseURL, res =>
	{
		if(res.statusCode != 200) {
			reject(new Error(res.statusMessage));
		}
		let data = "";
		res.on("data", (chunk) => {
			data += chunk;
		});
		res.on("end", () => {
			resolve(data);
		});
	})).then(data =>
	{
			const parsingArray = [];
			const $ = cheerio.load(data);

			$("tr", "tbody").each(function(i, elem)
			{
				const elemDat = $(this).html();
				let parsed = regex[0].exec(elemDat);
				if(parsed)
				{
					switch(parsed[4])
					{
						case "F":
							parsed[4] = "Fall";
							break;
						case "S":
							parsed[4] = "Spring";
							break;
						case "M":
						case "N":
							parsed[4] = "Summer";
							break;
						default:
							parsed [4] = "Undefined Case";
					}
					parsingArray.push(folCourseURL({
						title: parsed[3],
						courseCode: parsed[2],
						href: parsed[1],
						sem: parsed[4] + " 20" + parsed[5],
						completeAudio: false,
						completeLectures: false,
						completeVideo: false,
						onlineTextbooks: false,
						exams: false,
					}));
				}
				else
				{
					parsed = null;
					parsed = regex[1].exec(elemDat);
					if(parsed)
					{
						switch(parsed[4])
						{
							case "F":
								parsed[4] = "Fall";
								break;
							case "S":
								parsed[4] = "Spring";
								break;
							case "M":
							case "N":
								parsed[4] = "Summer";
								break;
							default:
								parsed [4] = "Undefined Case";
						}
						parsingArray.push(folCourseURL({
							title: parsed[3],
							courseCode: parsed[1],
							href: parsed[2]
						}));
					}
				}
			});
		return Promise.all(parsingArray);
	}).then(data =>
	{
		const result = [];
		for(let i = 0; i < data.length; i++)
		{
			if(data[i] != undefined && data[i].href != "") {
				result.push(data[i]);
			}
		}
		return result;
	}).catch((reason) => {
		console.log("getCScourses rejected:", reason);
	});
}

function folCourseURL(course)
{
	if(!regex[2].test(course.href)) {
		course.href = courseBaseURL + course.href;
	}
	else {
		course.href = course.href.replace(regex[2], "https");
	}

	return new Promise((resolve, reject) => 
		https.get(course.href, res =>
		{
			if(res.statusCode == 301) {
				reject(res);
			}
			else if(res.statusCode != 200) {
				reject(new Error(res.statusMessage));
			}
			let data = "";
			res.on("data", (chunk) => {
				data += chunk;
			});
			res.on("end", () => {
				resolve(data);
			});
	})).then(data => 
	{
		const $ = cheerio.load(data);
		course.href = $("strong:contains('Course Website:')").next().text();
		return course;
	}).catch((reason) =>
	{
		if(reason.statusCode == 301) {
			course.href = reason.headers.location;
			folCourseURL(course);
		}
		else {
			console.log("Promise in 'folCourseURL' rejected:", reason.statusMessage);
		}
	});
}

function results()
{
	const returnObj = {
		domain: "CMU",
		departments: [{
		name: "COMPUTERSCIENCE", courses: [],
	}]};
	return getCScourses().then(results => {
		returnObj.departments[0].courses = results;
		console.log("Fetched CMU CS courses");
		return returnObj;
	});
}

module.exports.name = "cmu";
module.exports.results = results;
