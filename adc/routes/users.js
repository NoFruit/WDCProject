var express = require('express');
var router = express.Router();
var db = require('../mysql');

/* GET users listing. */
router.get('/', function(req, res) {
  res.redirect('home.html');
});

router.get('/events', function(req, res) {
  res.redirect('events.html');
});

router.get('/profile', function(req, res) {
  res.redirect('profile.html');
});

module.exports = router;

router.get('/getprofile', function(req, res, next) {
  cookies = req.cookies;
  username = cookies.userState.username;
  db.Query('user', '*', "account = '" + username + "'").then( data => {
    username = res.send(data[0])
  })
  res.status(200);
});
