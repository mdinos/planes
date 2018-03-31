const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const path = require('path')
const config = require('./dbconfig.js')

// database initialise
let db = config.db
config.connectDB()
config.createDB()

const app = express()
app.use(session({
    store: db,
    secret: "violet k~itten`\#3%s",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/secret', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/splash.html'))
})

app.post('/api/login', function(req, res) {
    let body = req.body
    let username = req.body.user
    let password = req.body.pass
    let checkedUser = config.checkUser(username, password)
    console.log("p3: " + checkedUser)
    console.log(checkedUser.ok)
    /*if (!checkedUser.ok) {
        console.log("fake user")
        res.status(401)
    }
    else {
        console.log("real user")
        res.redirect('/secret')
    }*/
})

// Listen at 127.0.0.1:8080
app.listen(8080, function() {
    console.log("Server started, port 8080.")
})