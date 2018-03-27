// modules
const express = require('express')
const session = require('express-session')
const mysql = require('mysql')
const path = require('path')
const passwordHash = require('password-hash')
const app = express()

//database initialisation
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
})

// get authorization
//let auth.res

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
            });
    });
});

// app.use
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'violet trees',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000  } // 1 min
}))

// GET REQUESTS
// POST REQUESTS
app.post('/api/login', login)
app.post('/api/createuser', createUser)

// Listen at 127.0.0.1:8080
app.listen(8080, function() {
    console.log("Server started, port 8080.")
})

// SERVER FUNCTIONS

function login(req, res) {
    let username = req.query.username.toLowerCase()
    let password = req.query.password
    
    connection.query('SELECT * FROM users WHERE username = "' + username + '"', function (err, results) {
        if (err) {
            console.error(err)
        }
        else {
            console.log(results[0].id)
            console.log(passwordHash.verify(password, results[0].password))
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
        }
        else {
            console.log("User created: " + username)
        }
    })
}
