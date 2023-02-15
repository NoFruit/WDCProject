var con = require('mysql');

var con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'djb',
  password: '',
  database: 'base'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});