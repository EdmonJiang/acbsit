const router = require('express').Router()

router.get('/', function (req, res) {
  res.render('staff', {key: "Site_ID"});
})

router.post('/', setAcess, function (req, res) {
	res.end(__dirname);
 //  var child = require( 'child_process').exec('cscript /nologo getInfo.vbs ' + username, function(err, stdout, stderr) {
	// 	if (err){res.end("No item found in AD.");} 
	// 	else{
	// 		var userinfo = stdout.replace(/;/g,'<br /><br />');
	// 		res.writeHead(200, {'Content-Type': 'text/html'});
	// 		res.end(userinfo)
	// 	}
	// });
})

function setAcess (req,res,next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Acess-Control-Allow-Headers", "Origin, X-Requersted-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
}

module.exports = router