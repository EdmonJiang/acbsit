const router = require('express').Router()

router.get('/', function (req, res) {
  res.render('staff', {key: "Site_ID"});
})

module.exports = router