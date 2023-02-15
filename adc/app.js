var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    if (req.method === 'GET') {
        let {url} = req,
            cookies = req.cookies;

        if (!!cookies.userState){
            if(url.slice(0,3) != '/us')
            {res.redirect('/users' + url);}
        }
       //if (url === '/index.html' && !cookies.userState) {
       //  res.redirect('/login.html')
       //}
      }
      next()
})

app.use(express.static(__dirname+"/public",{index:"home.html"}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
