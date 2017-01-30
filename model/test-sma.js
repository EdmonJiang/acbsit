const SMA = require('./sma')

SMA.findOne({"Primary User": "ssiej"}, function (err, docs) {
	console.log(docs)
})