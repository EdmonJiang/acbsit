const router = require('express').Router()

router.get('/', function (req, res) {
  res.render('adinfo', {});
})

function setAcess (req,res,next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Acess-Control-Allow-Headers", "Origin, X-Requersted-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
}

module.exports = router