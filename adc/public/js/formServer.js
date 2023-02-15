var http = require('http');
var querystring = require('querystring');
var mysql = require('mysql');
var multiparty = require('multiparty');
var form = new multiparty.Form(); //解析formData里面数据的模块

var server = http.createServer(function(requset, respone) {
    var data;
    //非formData的表单提交
    // requset.on('data',function(a){
    // 	data = querystring.parse(decodeURIComponent(a));
    // 	console.log('数据：',data);
    // })

    //formData的表单提交
    form.parse(requset, function(err, a) {
        console.log(a);
        data = a;
    });
    requset.on('end', function(a) {
        console.log('接收数据完成!');
        connect(data);
        respone.end(JSON.stringify({ statua: 200, msg: '请求成功', data: { data } }));
    })
    // respone.setHeader('Access-Control-Allow-Origin','*');  //解决跨域问题
    respone.writeHead(200, { 'Content-Type': 'application/json;chatset=utf-8' });
}).listen(8080, 'www.test.com'); // api接口：www.test.com:8080

// 使用连接池去连接服务器
var pool = mysql.createPool({
    host: 'localhost',
    database: 'user', //数据库表名
    port: 3306,
    user: 'root',
    password: '123456789'
})

function connect(params) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log('与mysql数据库建立连接失败');
        } else {
            var addSe = 'insert into user(name,age,sex,tel) value (?,?,?,?)';
            var addData = [params.name, params.age, params.sex, params.tel];
            connection.query(addSe, addData, function(err, result) {
                if (err) {
                    console.log('插入数据失败', err);
                } else {
                    console.log('插入数据成功');
                    connection.release();
                }
            })
        }
    })
    //处理数据库服务器连接中断时的操作
    pool.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('与mysql数据库之间的连接丢失');
            //3秒后重新尝试连接数据库
            setTimeout(function() {
                connect();
            }, 3000);
        } else {
            throw err;
        }
    })
}