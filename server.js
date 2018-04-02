const express = require('express')
const passwordHash = require('password-hash')
const bodyParser = require('body-parser')
const path = require('path')
const config = require('./dbconfig.js')

// database initialise
let db = config.db
config.connectDB()
config.createDB()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/app', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/splash.html'))
})

app.get('/api/checkuser', function(req, res) {
    
})

app.post('/api/createuser', function(req, res) {
    console.log("hello start")
    let body = req.body
    let username = body.user.toLowerCase()
    let password = body.pass
    let email = body.email.toLowerCase()
    let hashedPassword = passwordHash.generate(password)
    console.log("hello")
    config.createUser(username, hashedPassword, email, function(createdUser) {
        console.log("in function")
    })
    console.log("whatsgoinon")
    res.sendStatus(200)
})

app.post('/api/login', function(req, res) {
    let body = req.body
    let username = body.user.toLowerCase()
    let password = body.pass
    
    config.checkUser(username, password, function(checkedUser) {
        if (!checkedUser.ok) {
            let response = JSON.stringify({
                'ok': false
            })
            res.status(401).send(response)
        }
        else {
            let response = JSON.stringify({
                'user': username,
                'userid': checkedUser.userid,
                'ok': true
            })
            res.status(200).send(response)
        }
    })
})

// Listen at 127.0.0.1:8080
app.listen(8080, function() {
    console.log("Server started, port 8080.")
})