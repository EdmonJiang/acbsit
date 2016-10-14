const router = require('express').Router()

router.get('/', function (req, res) {
  res.render('adinfo', {});
})

module.exports = router