const createError = require('http-errors');
const logger = require('morgan');
const path = require("path");

const express = require('express');
const app = express();

const mitParser = require(__dirname + "/parsers/mit-parser");

const cache = {};

// Setup view engine
const viewsDirectory = __dirname + "/views";
app.set('views', viewsDirectory);
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const publicDirectory = path.join(__dirname, "public");
app.use(express.static(publicDirectory));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/**
 * MARK: Custom routing
 */

app.get("/", (req, res) => {
    const indexPath = path.join(publicDirectory, "webpages", "index.html");
    res.sendFile(indexPath);
});


app.get("/resources", (req, res) => {
    const parsers = [mitParser].map(parser => {
        return parser.results().then(result => {
            cache[parser.name] = result;
        });
    });

    if(cache.isEmpty()) {
        Promise.all(parsers).then(_ => res.send(cache));
    } else {
        console.log("-----> Sending from cache",);
        res.send(cache);
        Promise.all(parsers).then();
    }
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