const router = require('express').Router()
const request = require('request')
const cheerio = require('cheerio')

router.get('/', function (req, res) {
  res.render('ipt');
})

router.post('/', function (req, res) {
	var data = req.body.email;
	if(!data){
		res.end('error');
		return;
	}
	var post_options = {
      url: 'http://10.25.8.14/rpts/ipt/ui/UserDeviceDetail.php',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Host':'10.25.8.14',
		  'Origin':'http://10.25.8.14'
      },
      form: { Clusterrole: 'begins with',
			  Cluster: '',
			  Regionrole: 'begins with',
			  Region: '',
			  Countryrole: 'begins with',
			  Country: '',
			  Cityrole: 'begins with',
			  City: '',
			  FAMrole: 'begins with',
			  FAM: '',
			  Business_Arearole: 'begins with',
			  Business_Area: '',
			  Last_Namerole: 'begins with',
			  Last_Name: '',
			  First_Namerole: 'begins with',
			  First_Name: '',
			  Email_Addressrole: 'begins with',
			  Email_Address: data,
			  Login_IDrole: 'begins with',
			  Login_ID: '',
			  Device_Namerole: 'begins with',
			  Device_Name: '',
			  Line_numberrole: 'begins with',
			  Line_number: '',
			  Device_Modelrole: 'begins with',
			  Device_Model: '',
			  Device_Category_IDrole: 'begins with',
			  Device_Category_ID: '',
			  Device_Categoryrole: 'begins with',
			  Device_Category: '',
			  button: 'btnFilter' }
	};

	request(post_options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body){
				var $ = cheerio.load(body)
				var infoTable = $('div.table-responsive').html()
        		res.end(infoTable)
			}
    	}else{
    		res.end("error")
    	}
	})
})

module.exports = router