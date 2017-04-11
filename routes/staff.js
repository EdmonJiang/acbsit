const router = require('express').Router()
const https = require('https')

router.get('/', function (req, res) {
  res.render('staff');
})

router.get('/users', function (req, res) {

	if (req.query.key && req.query.value) {

		var q_key = req.query.key.trim();
		var q_value = req.query.value.trim();
		q_value = ~q_key.toUpperCase().indexOf('ADMAIL')  && ~q_value.indexOf(' ') ? q_value.split(' ').join('.') : q_value;

		var option = {
			host: 'ssiscndb0018.apac.group.atlascopco.com',
			port: 443,
			path: '/mds/staffs?' + encodeURIComponent(q_key) + '=' + encodeURIComponent(q_value),
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