const router = require('express').Router()

router.get('/', function (req, res) {
  res.render('acbus', {});
})

module.exports = router