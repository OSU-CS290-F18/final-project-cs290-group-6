const express = require("express");
const router = express.Router();

const path = require("path");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const Schema = mongoose.Schema;


const mitParser = require(path.join(__dirname, "../parsers/mit-parser"));
const cmuParser = require(path.join(__dirname, "../parsers/cmu-Parser"));
const parsers = [mitParser, cmuParser]; // Add more parsers here

const DomainSchema =  new Schema({
    _id: String,
    domain: String,
    departments: JSON
});
const DomainCollection = mongoose.model("domains", DomainSchema);
mongoose.connect("mongodb://localhost:27017/final-project", {useNewUrlParser: true}).then(_ => {
    console.log("Connected to database");
    const requests = parsers.map(parser => parser.results());
    return Promise.all(requests);
}).then(results => {
    const queries = results.map(result => {
        const update = {domain: result.domain, departments: result.departments};
        return DomainCollection.findByIdAndUpdate(result.domain.toLowerCase(), update, {upsert: true});
    });

    return Promise.all(queries);
}).then(savedObjects => {
    console.log(savedObjects);
}).catch(err => {
    console.log(err);
});

router.get("/", (req, res) => {
    DomainCollection.find({}).then(docs => {
        const responseObject = docs.reduce((responseObject, doc) => {
            responseObject[doc._id] = {domain: doc.domain, departments: doc.departments};
            return responseObject;
        }, {});

        console.log(responseObject);
        res.send(responseObject);
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;
