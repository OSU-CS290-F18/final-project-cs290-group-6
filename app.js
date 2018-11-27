const createError = require('http-errors');
const logger = require('morgan');
const path = require("path");

const express = require('express');
const app = express();

const mitParser = require(__dirname + "/parsers/mit-parser");

// Setup view engine
const viewsDirectory = __dirname + "/views";
app.set('views', viewsDirectory);
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const publicDirectory = path.join(__dirname, "public");
app.use(express.static(publicDirectory));


/**
 * MARK: Custom routing
 */

app.get("/", (req, res) => {
    const indexPath = path.join(publicDirectory, "webpages", "index.html");
    res.sendFile(indexPath);
});
app.get("/index.html", (req, res) => {
    const indexPath = path.join(publicDirectory, "webpages", "index.html");
    res.sendFile(indexPath);
});

app.get("/about.html", (req, res) => {
    const aboutPath = path.join(publicDirectory, "webpages", "about.html");
    res.sendFile(aboutPath);
});

app.get("/advancedSearch.html", (req, res) => {
    const searchPath = path.join(publicDirectory, "webpages", "advancedSearch.html");
    res.sendFile(searchPath);
});

app.get("/resources", (req, res) => {
    const allCourses = {};
    const parsers = [mitParser].map(parser => {
        return parser.results().then(result => {
            allCourses[parser.name] = result;
        });
    });

    console.log("Fetching resources...");
    Promise.all(parsers).then(() => {
        res.send(allCourses)
    });
});


/**
 * MARK: Error Handling
 */

// Catch 404 and forward to error handler -->
app.use((req, res, next) => {
    next(new createError.NotFound());
});

// --> Error handler <--
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;