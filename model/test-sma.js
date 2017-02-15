const mongoose = require('mongoose')
const SMA = require('./sma')
mongoose.connect("mongodb://acbs:atlas@10.86.32.210:27017/acbsit");

/*SMA.findOne({"Primary User": "ssiej"}, function (err, docs) {
	console.log(docs)
})*/

SMA.aggregate(
    [
        // query pipeline
        { "$match": { "PC Name": /^cnf/i } },
        // Grouping pipeline
        { "$group": { 
            "_id": "$"+"PC Name", 
        }},
        // Optionally limit results
        { "$limit": 5 }
    ],
    function(err,result) {
    	console.log(result)
       // Result is an array of documents
    }
);