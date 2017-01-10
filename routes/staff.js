const router = require('express').Router()
const https = require('https')

router.get('/', function (req, res) {
  res.render('staff');
})

router.post('/', function (req, res) {

	if (req.body.q.key && req.body.q.value) {

		var q_key = encodeURIComponent(req.body.q.key);
		var q_value = encodeURIComponent(req.body.q.value);
		var option = {
			host: 'ssiscndb0018.apac.group.atlascopco.com',
			port: 443,
			path: `/mds/staffs?${q_key}=${q_value}`,
			method: 'GET',
			rejectUnauthorized: false,
			headers: {
				accept: '*/*'
			}
		}

		var request = https.request(option, (response) => {
			var body = ''
			response.on('data', (data) => {
				body += data
			})

			response.on('end', () => {
				res.json(body)
			})
		})

		request.end()

		request.on('error', (e) => {
			res.end()
		})

	}else{
		res.end()
	}
})

module.exports = router