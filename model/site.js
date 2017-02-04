const mongoose = require('mongoose');
//	config = require('../config/config');

//const conn = mongoose.createConnection(config.ubuntu_uri);

const SiteSchema = new mongoose.Schema({
	City: String,
	Subnets: [String],
	Site_address: String,
	Country: String,
	Region: String,
	Site_ID: String
},{collection: 'site'});

module.exports = mongoose.model('Site', SiteSchema);