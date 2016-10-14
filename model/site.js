var mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
	City: String,
	Subnets: [String],
	Site_address: String,
	Country: String,
	Region: String,
	Site_ID: String
},{collection: 'post'});

module.exports = mongoose.model('Site', SiteSchema);