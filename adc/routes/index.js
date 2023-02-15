var express = require('express');
var router = express.Router();
var db = require('../mysql');
const nodemailer = require('nodemailer');
const config = {
  client_ID: 'b462820ef529f30f4661',
  client_Secret: '3685f556cc30ac5fd5e978d9de13e624b0ebcf65',}

function sendEmail (data){
  let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: 'oozzozoz@qq.com',
      pass: 'svkxnhvfvmpbdghf',
    }
  });
  let mailOptions = {
    from: '"O!Z!" <oozzozoz@qq.com>',
    to: data.email,
    subject: 'test',
    html: data.content
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      return console.log(error);
    }
    console.log('success ID: ', info.messageId);
  });
}



/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('home.html');
});

router.get('/events', function(req, res) {
  res.redirect('events.html');
});

router.get('/details', function(req, res) {
  res.redirect('details.html');
});

router.get('/profile', function(req, res) {
  res.redirect('profile.html');
})

module.exports = router;


router.get('/testquery', function(req, res, next) {
  a = db.Query('select * from events');
  b = a.then((data)=>{
  console.log(data);
  res.send(data)
  })
});

router.post('/login', function(req, res, next) {
  res.clearCookie('userState')
  let {account, password} = req.body
  res.status(200)
  res.type('application/json')

  a = db.Query('user', '*', req.body);
  a.then(data=> {
    let check = data.length === 0
    if (check) {
      res.send('Account or password is wrong');
    } else {
      res.cookie('userState', {isLogin: true, username: account})
      res.redirect('/');
    }
  })
});

router.post('/regist', function(req, res, next) {
    let {account, nickname, E_mail, password} = req.body;
    req.body.usergroup = 'user';
    usergroup = 'user'
    delete req.body.confirm;
    mails = {email: "", content: "Welcome to our website!"}
    mails.email = E_mail;
    sendEmail(mails);
    a = db.Query('user', '*', account)
    a.then(data => {
      let check = data.length !== 0;
      if (check) {
        return Promise.reject()
      }
      return Promise.resolve()
    }).then(data => {
      sql = "insert into user (account, nickname, E_mail, password, usergroup) values ('"+account+"', '"+nickname+"', '"+E_mail+"', '"+password+"', '"+usergroup+"')"
      return db.Exec(sql)
    }).catch(()=>{
      res.send('Account already exists')
    }).then(data=>{
      res.send('Regist success');
    }).catch(()=>{})
})
