// modules
const express = require('express')
const session = require('express-session')
const mysql = require('mysql')
const path = require('path')
const passwordHash = require('password-hash')
const app = express()

//database initialisation
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'planesdb'
}

const connection = mysql.createConnection(dbOptions)

// database connection
connection.connect(function(err) {
    if(err) {
        console.error('error connecting: ' + err.stack)
        return
    }
    else {
        console.log('Connected, ID is ' + connection.threadId)
    }
})

// create database if doesnt exist
connection.query('CREATE DATABASE IF NOT EXISTS planesdb', function (err) {
    if (err) throw err;
    connection.query('USE planesdb', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS users('
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
        connection.query('CREATE TABLE IF NOT EXISTS sessions('
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

// app.use
app.use(express.static(path.join(__dirname, 'public')))
app.use((err, req, res, next) => { console.log(err); res.send(err); })

// GET REQUESTS
app.get('/api/postlogin', postLogin)
// POST REQUESTS
app.post('/api/login', login)
app.post('/api/createuser', createUser)

// Listen at 127.0.0.1:8080
app.listen(8080, function() {
    console.log("Server started, port 8080.")
})

// SERVER FUNCTIONS

// Date function
let d = new Date()
// Secret key for generating random tokens
let key = "violet k~itten`\#3%s"

function postLogin(req, res) {
    if (!authorize(userid, token)) {}
}

// login post function
function login(req, res) {
    let username = req.query.username.toLowerCase()
    let password = req.query.password
    connection.query('SELECT * FROM users WHERE username = "' + username + '"', function (err, results) {
        if (err) {
            console.error(err)
        }
        // check password against database hashed password
        else {
            console.log(results[0].id)
            console.log(passwordHash.verify(password, results[0].password))
            if (!passwordHash.verify(password, results[0].password)) {
                console.log("password wrong")
                res.status(401).send("Incorrect login details!")
            }
            else {
                console.log("hello")
                let userid = results[0].id;
                let date = d.getTime();
                let tokenNum = (Math.random() * Math.random()).toString()
                let token = passwordHash.generate(key + tokenNum)
                connection.query('INSERT INTO sessions '
                                 + '(userid, dateStarted, token)'
                                 + ' VALUES (' 
                                 + userid 
                                 + ', "' 
                                 + date 
                                 + '", "' 
                                 + token 
                                 + '")', function (err) {
                    if (err) {
                        console.log("Error inserting session data")
                        if (err.errno == 1062) {
                            console.log("Already in session")
                        }
                    }
                    else {
                        console.log("session data inserted")
                    }
                })
            }
        }
    })
}

function authorized(userid, token) {
    let date = getTime();
    connection.query('Select * FROM sessions WHERE userid = ' + userid, function (err, results) {
        if (err) throw err;
        if ((results[0].dateStarted + 86400000) > date) {
            return false
        }
        else {
            return true
        }
    })
}

function createUser(req, res) {
    let username = req.query.username.toLowerCase()
    let password = req.query.password
    let email = req.query.email.toLowerCase()
    
    // hashing passwords prior to passing to the database for storage
    let hashedPassword = passwordHash.generate(password)
    
    connection.query('INSERT INTO users '
    + '(username, password, email)'
    + ' VALUES ("' + username + '", "' + hashedPassword + '", "' + email + '")', function (err) {
        if (err) {
            console.log("Error inserting user data into table 'users'.")
            console.error(err)
            res.status(500)
        }
        else {
            console.log("User created: " + username)
            res.status(200)
        }
    })
}