var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/main', { title: 'firstPage' });
});

router.get('/secondPage', function(req, res, next) {
  res.render('pages/secondPage', { title: 'secondPage' });
});

module.exports = router;
