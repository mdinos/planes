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

app.post('/api/splash', function(req, res) {
    let body = req.body
    let userid = body.id
    config.checkUser(userid, function(checkedUser) {
        if (!checkedUser.ok) {
            res.sendStatus(401)
            console.log("401")
        }
        else {
            console.log("all good")
            return res.redirect('../splash.html')
        }
    })
})

app.post('/api/createuser', function(req, res) {
    let body = req.body
    let username = body.user.toLowerCase()
    let password = body.pass
    let email = body.email.toLowerCase()
    let hashedPassword = passwordHash.generate(password)
    config.createUser(username, hashedPassword, email)
    res.sendStatus(200)
})

app.post('/api/login', function(req, res) {
    let body = req.body
    let username = body.user.toLowerCase()
    let password = body.pass
    
    config.checkUserLogin(username, password, function(checkedUser) {
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

// Listen at 127.0.0.1:3000
app.listen(3000, function() {
    console.log("Server started, port 3000.")
})