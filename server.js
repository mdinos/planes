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

// Redirects to splash page if allowed to log in
app.post('/api/splash', function(req, res) {
    let body = req.body
    let userid = body.id
    config.checkUser(userid, function(checkedUser) {
        if (!checkedUser.ok) {
            res.sendStatus(401)
            return
        }
        else {
            return res.redirect('../splash.html')
        }
    })
})

// Creates new user
app.post('/api/createuser', function(req, res) {
    let body = req.body
    let username = body.user.toLowerCase()
    let password = body.pass
    let email = body.email.toLowerCase()
    let hashedPassword = passwordHash.generate(password)
    config.createUser(username, hashedPassword, email)
    res.sendStatus(200)
})

// Checks if user is allowed to log in, returns username and userid
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

// Server function to add a module to database
app.post('/api/addmodule', function(req, res) {
    let body = req.body
    let userid = body.userid
    let title = body.title
    let sessionCount = body.sessionCount
    let desc = body.desc
    let modId;
    let response;
    
    config.createModule(userid, title, function(newModule) {
        if (!newModule.ok) {
            response = {
                'ok': false
            }
            res.status(500).send(JSON.stringify(response)).end()
        }
        else {
            modId = newModule.modId;
            response = {
                'modId': modId,
                'ok': true
            }
        }
        config.updateModuleDescription(modId, desc)
        config.updateModuleSessionCount(modId, sessionCount)
        
        res.status(200).send(JSON.stringify(response))
    })
})

// Retrieve module data from database
app.post('/api/getusermodules', function(req, res) {
    let userid = req.body.userid
    config.getUsersModules(userid, function(modules) {
        let response = JSON.stringify(modules)
        res.status(200).send(modules)
    })
})

// Listen at 127.0.0.1:3000
app.listen(3000, function() {
    console.log("Server started, port 3000.")
})