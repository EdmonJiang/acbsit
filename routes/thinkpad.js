const router = require('express').Router()
const request = require('request')
const config = require('../config/config')
const reg = /^[0-9A-Z]{7}$/
const url = 'http://think.lenovo.com.cn/service/handlers/WarrantyConfigInfo.ashx?Method=WarrantyConfigSearch&MachineNo='
const headers = {'Accept': 'application/json',
           		 'X-Requested-With':'XMLHttpRequest',
           		 'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'}

router.get('/', function (req, res) {
  res.render('thinkpad', {});
})

router.post('/', function (req, res) {

	if (req.body.sn) {

		request({
			url: url+req.body.sn,
			method: 'GET',
			headers: headers
		},function (err,response,body) {
			if (err) {
				res.json({error: "Failed to get warranty information."})
			} else {
				var data = JSON.parse(body)
				if (data.status === 200) {
					res.json(data)
				} else {
					res.json({error: data.message})
				}
			}
		})

	} else {
		res.json({error: "No serial number provided."})
	}
})

module.exports = router