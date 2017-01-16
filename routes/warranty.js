const router = require('express').Router()
const request = require('request')
const config = require('../config/config')
const reg = /^[0-9A-Z]{7}$/
const url = config.url
const headers = {'Content-Type': 'application/x-www-form-urlencoded',
           		 'apikey': config.key}

router.get('/', function (req, res) {
  //res.setHeader('Cache-Control', 'public, max-age=86400');
  res.render('warranty');
})

router.post('/', function (req, res) {

	if (req.body.sn) {
		var sn = req.body.sn
		if(reg.test(sn))
		{
			request.post({url,headers:headers,form:{'ID':sn}},function(err,response,body){
				//console.log(body)
				if(err){
					res.json({error: "No information found!"})
					return;
				}
				var data = JSON.parse(body)
				var warrantybody = data.AssetWarrantyResponse[0]
				if (warrantybody) {
					
					res.json({
						assetheader: warrantybody.AssetHeaderData || {},
						assetdata: warrantybody.AssetEntitlementData || []
					})
				} else {
					res.json({error: "No information found for the service tag."})
				}

			})
		}else{
			res.json({error: "Invalid DELL service tag."})
		}
	} else {
		res.json({error: "Query parameter 'sn' not found."})
	}
})

router.get('/dell', function (req, res) {

	if (req.query.sn) {
		var sn = req.query.sn
		if(reg.test(sn))
		{
			request.post({url,headers:headers,form:{'ID':sn}},function(err,response,body){
				//console.log(body)
				if(err){
					res.json({error: "No information found!"})
					return;
				}
				var data = JSON.parse(body)
				var warrantybody = data.AssetWarrantyResponse[0]
				if (warrantybody) {
					
					res.json(warrantybody.AssetEntitlementData || [] )
				} else {
					res.json({error: "No information found for the service tag."})
				}

			})
		}else{
			res.json({error: "Invalid DELL service tag."})
		}
	} else {
		res.json({error: "Query parameter 'sn' not found."})
	}
})

function getWarranty (tag) {
	request.post({url,headers:headers,form:{'ID':tag}},function(err,response,body){
		//console.log(body)
		var data = JSON.parse(body)
		var warrantybody = data.AssetWarrantyResponse[0]
		return {
			assetheader: warrantybody.AssetHeaderData || {},
			assetdata: warrantybody.AssetEntitlementData || []
		}

	})
}

module.exports = router