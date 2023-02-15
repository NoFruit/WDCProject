var mysql = require('mysql');

var _mysqlConfig = {
    host: '127.0.0.1',
    database: 'base',
    user: '',
    password: ''
}

var _config = _mysqlConfig;

const setConfig = function(dbConfig) {
    for (var k in dbConfig) {
        _config[k] = dbConfig[k]
    }
}

const getConfig = function() {
    return _config
}

// 执行sql 语句 根据arguments重载
// Exec(Sql)
const Exec = function(sql) {
    return new Promise(function(rs, rj) {
        var mysqlConn = mysql.createConnection(_config)
        mysqlConn.query(sql, function(error, results, fields) {
            if (error) return rj(error);
            return rs(results)
        });
        mysqlConn.end();
    })
}


// 执行查询sql语句 根据arguments重载
// Query('select ...')
// Query('table','filed','where or {where}')
// Query('table','filed','where or {where}','order')
// Query('table','filed','where or {where}','order',p,s)
const Query = function() {
    var args = arguments
    return new Promise(function(rs, rj) {
        if (args.length == 0) rj(`arguments is not exist!!!`)

        var sql = ""
        if (args.length == 1 && typeof args[0] == "string") sql = args[0]


        if (args.length >= 2 && typeof args[0] == "string" && typeof args[1] == "string") {
            var filed = args[1];
            var where = ` 1=1 `
            var order = `order by ${args[3] || "id"}`

            if (typeof args[2] == "string") where += args[2] ? ` and ${args[2]} ` : "";

            if (typeof args[2] == 'object' && !(args[2] instanceof Array)) {
                // 拼接where
                for (var k in args[2]) {
                    if (typeof args[2][k] == 'string') {
                        where += ` and \`${k}\`='${args[2][k]}' `;
                    } else {
                        where += ` and \`${k}\`=${args[2][k]} `;
                    }
                }
            }

            sql += `select ${filed} from ${args[0]} where ${where} `
            if (args[3]) sql += order


            if (args[4]) {
                var p = Number(args[4] || 1)
                var s = Number(args[5] || 15)
                sql += ` limit ${s} offset ${((p-1)*s)}`
            }
        }

        if (!sql) return rj(`t-sql is not exist!!!`)
        // console.log(sql)
        // 执行sql语句
        var mysqlConn = mysql.createConnection(_config)
        mysqlConn.query(sql, function(error, results, fields) {
            if (error) return rj(error);
            return rs(results)
        });
        mysqlConn.end();
    })
}

// 执行insert语句 根据arguments重载
// Insert('table',{data})
// Insert('insert ...')
const Insert = function() {
    var args = arguments
    return new Promise(function(rs, rj) {
        if (args.length == 0) rj(`arguments is not exist!!!`)


        var sql = ""
        if (args.length == 1 && typeof args[0] == "string") sql = args[0]


        if (args.length == 2 && typeof args[0] == "string" && typeof args[1] == "object" && !(args[1] instanceof Array)) {
            var filed = ``;
            var values = ``
            for (var k in args[1]) {
                filed += `\`${k}\`,`
                if (typeof args[1][k] == 'string') {
                    values += `'${args[1][k]}',`;
                } else {
                    values += `${args[1][k]},`;
                }
            }
            if (!filed || !values) {
                return rj(`filed or values is not exist!!!`)
            }

            filed = filed.substr(0, filed.length - 1)
            values = values.substr(0, values.length - 1)

            sql += `insert into ${args[0]} (${filed})values(${values})`
        }

        if (!sql) return rj(`t-sql is not exist!!!`)
        // 执行sql语句
        var mysqlConn = mysql.createConnection(_config)
        mysqlConn.query(sql, function(error, results, fields) {
            if (error) return rj(error);
            return rs(results)
        });
        mysqlConn.end();

    })
}

// 执行update语句 根据arguments重载
// Update('table',{data},{where})
// Update('update ...')
const Update = function() {
    var args = arguments
    return new Promise(function(rs, rj) {
        if (args.length == 0) rj(`arguments is not exist!!!`)


        var sql = ""
        if (args.length == 1 && typeof args[0] == "string") sql = args[0]


        if (args.length >= 2 && typeof args[0] == "string" && typeof args[1] == "object" && !(args[1] instanceof Array)) {
            var sets = ``;
            var where = ` 1=1 `

            for (var k in args[1]) {
                if (typeof args[1][k] == 'string') {
                    sets += `\`${k}\`='${args[1][k]}',`;
                } else {
                    sets += `\`${k}\`=${args[1][k]},`;
                }
            }

            if (typeof args[2] == "string") where += ` and ${args[2]}`
            if (typeof args[2] == "object" && !(args[2] instanceof Array)) {
                for (var k in args[2]) {
                    if (typeof args[2][k] == 'string') {
                        where += ` and \`${k}\`='${args[2][k]}' `;
                    } else {
                        where += ` and \`${k}\`=${args[2][k]} `;
                    }
                }
            }


            if (!sets) {
                return rj(`sets is not exist!!!`)
            }

            sets = sets.substr(0, sets.length - 1)

            sql += `update ${args[0]} set ${sets} where ${where}`
        }


        if (!sql) return rj(`t-sql is not exist!!!`)

        // 执行sql语句
        var mysqlConn = mysql.createConnection(_config)
        mysqlConn.query(sql, function(error, results, fields) {
            if (error) return rj(error);
            return rs(results)
        });
        mysqlConn.end();
    })
}

// 删除操作 根据arguments重载
// Delete('delete ...')
// Delete('table',{where})
const Delete = function() {
    var args = arguments
    return new Promise(function(rs, rj) {
        if (args.length == 0) rj(`arguments is not exist!!!`)


        var sql = ""
        if (args.length == 1 && typeof args[0] == "string") sql = args[0]

        if (args.length == 2 && typeof args[0] == "string") {
            var where = ` 1=1 `

            if (typeof args[1] == "string") where += args[1] ? ` and ${args[1]}` : ""
            if (typeof args[1] == "object" && !(args[1] instanceof Array)) {
                for (var k in args[1]) {
                    if (typeof args[1][k] == 'string') {
                        where += ` and \`${k}\`='${args[1][k]}' `;
                    } else {
                        where += ` and \`${k}\`=${args[1][k]} `;
                    }
                }
            }
            // console.log(sql)

            sql += `delete from ${args[0]} where ${where}`
        }


        if (!sql) return rj(`t-sql is not exist!!!`)

        // 执行sql语句
        var mysqlConn = mysql.createConnection(_config)
        mysqlConn.query(sql, function(error, results, fields) {
            if (error) return rj(error);
            return rs(results)
        });
        mysqlConn.end();
    })
}

// 获取第一行的数据 根据arguments重载
// Query('select ...')
// Query('table','filed','where or {where}')
const First = function() {
    var args = arguments
    return new Promise(function(rs, rj) {
        if (args.length == 0) rj(`arguments is not exist!!!`)

        var sql = ""
        if (args.length == 1 && typeof args[0] == "string") sql = args[0]


        if (args.length >= 2 && typeof args[0] == "string" && typeof args[1] == "string") {
            var filed = args[1];
            var where = ` 1=1 `

            if (typeof args[2] == "string") where += args[2] ? ` and ${args[2]} ` : "";

            if (typeof args[2] == 'object' && !(args[2] instanceof Array)) {
                // 拼接where
                for (var k in args[2]) {
                    if (typeof args[2][k] == 'string') {
                        where += ` and \`${k}\`='${args[2][k]}' `;
                    } else {
                        where += ` and \`${k}\`=${args[2][k]} `;
                    }
                }
            }

            sql += `select ${filed} from ${args[0]} where ${where} `

            sql += ` limit 1 `
        }

        if (!sql) return rj(`t-sql is not exist!!!`)
        // console.log(sql)
        // 执行sql语句
        var mysqlConn = mysql.createConnection(_config)
        mysqlConn.query(sql, function(error, results, fields) {
            if (error) return rj(error);
            return rs(results.length ? results[0] : null)
        });
        mysqlConn.end();
    })
}


// 获取第一行第一列的数据 根据arguments重载
// Query('select ...')
// Query('table','filed','where or {where}')
const FirstValue = function() {
    var args = arguments
    return new Promise(function(rs, rj) {
        if (args.length == 0) rj(`arguments is not exist!!!`)

        var sql = ""
        if (args.length == 1 && typeof args[0] == "string") sql = args[0]


        if (args.length >= 2 && typeof args[0] == "string" && typeof args[1] == "string") {
            var filed = args[1];
            var where = ` 1=1 `

            if (typeof args[2] == "string") where += args[2] ? ` and ${args[2]} ` : "";

            if (typeof args[2] == 'object' && !(args[2] instanceof Array)) {
                // 拼接where
                for (var k in args[2]) {
                    if (typeof args[2][k] == 'string') {
                        where += ` and \`${k}\`='${args[2][k]}' `;
                    } else {
                        where += ` and \`${k}\`=${args[2][k]} `;
                    }
                }
            }

            sql += `select ${filed} from ${args[0]} where ${where} `

            sql += ` limit 1 `
        }

        if (!sql) return rj(`t-sql is not exist!!!`)
        // console.log(1, sql, 2)
        // 执行sql语句
        var mysqlConn = mysql.createConnection(_config)
        mysqlConn.query(sql, function(error, results, fields) {
            if (error) return rj(error);
            result = results.length ? results[0] : null
            if (result) {
                for (var k in result) {
                    return rs(result[k])
                }
            }
        });
        mysqlConn.end();
    })
}

module.exports = {
    setConfig,
    getConfig,
    Exec,
    Query,
    Insert,
    Update,
    Delete,
    First,
    FirstValue
}