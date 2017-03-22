const router = require('express').Router()
const https = require('https')

router.get('/', function (req, res) {
  res.render('staff');
})

router.get('/users', function (req, res) {

	if (req.query.key && req.query.value) {

		var q_key = encodeURIComponent(req.query.key);
		var q_value = encodeURIComponent(req.query.value);

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
				res.json(JSON.parse(body))
			})
		})

		request.end()

		request.on('error', (e) => {
			res.json([])
		})

	}else{
		res.json([])
	}
})

module.exports = router