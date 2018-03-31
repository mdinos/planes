const mysql = require('mysql')
const passwordHash = require('password-hash')
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'planesdb'
}

db = mysql.createConnection(dbOptions)

exports.db = db

exports.connectDB = function() {
    db.connect(function(err) {
        if(err) {
            console.error('error connecting: ' + err.stack)
            return
        }
        else {
            console.log('Connected, ID is ' + db.threadId)
        }
    })
}

exports.createDB = function() {
    db.query('CREATE DATABASE IF NOT EXISTS planesdb', function (err) {
        if (err) throw err;
        db.query('USE planesdb', function (err) {
            if (err) throw err;
            db.query('CREATE TABLE IF NOT EXISTS users('
                + 'id INT NOT NULL AUTO_INCREMENT,'
                + 'PRIMARY KEY(id),'
                + 'username VARCHAR(30) NOT NULL,'
                + 'password VARCHAR(150) NOT NULL,'
                + 'email VARCHAR(150) NOT NULL'
                +  ') ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;', function (err) {
                if (err) {
                    console.log("Error:")
                    console.error(err)
                }
                else {
                     console.log("Table query successful.")
                }
            })
            db.query('CREATE TABLE IF NOT EXISTS sessions('
                            + 'userid INT NOT NULL,' 
                            + 'PRIMARY KEY(userid),'
                            + 'dateStarted VARCHAR(15) NOT NULL,'
                            + 'token VARCHAR(150) NOT NULL)', function (err) {
                if (err) {
                    console.log("Error: ")
                    console.error(err)
                }
                else {
                    console.log("Session query successful.")
                }
            })
        })
    })
}

exports.checkUser = async function(username, password) {
    let response = await db.query('SELECT * FROM users WHERE username = "' + username + '"', function (err, results) {
        let response = {};
        if (err) {
            console.error(err)
            response.ok = false
        }
        else if (!passwordHash.verify(password, results[0].password)) {
            console.log("password wrong")
            response.ok = false
        }
        else {
            let userid = results[0].id
            response.ok = true
            response.userid = userid
        }
        console.log("p1: " + response)
        return response
    })
    .then(function() {
        console.log("p2: " + response)
        return response
    })
}