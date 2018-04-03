document.addEventListener("DOMContentLoaded", function(e) {
    console.log("DOM Loaded")
    
    // Animate top bar
    let navButton = document.getElementById('navButton')
    navButton.addEventListener("click", toggleNavUpDown)
    
    // Add module form unhiding
    let addModule = document.getElementById('addModule')
    addModule.addEventListener("click", unhideForm)
    
    // Add greeting on login splash page
    let greeting = document.getElementById('greeting')
    greeting.innerHTML += " " + sessionStorage.getItem('username') + "!"
    
    // Load modules
    loadUserData()
})

// Checks potential user information for validity
// if all ok, passes information to server to be placed within the database
// if all ok, redirects to login page
async function createAccount() {
    // regex for checking validity of inputs
    let usernamePattern = /[A-Za-z0-9]{4,15}/
    let pwPattern = /^(?=.*\d).{6,30}$/
    let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
    // grab potential user information form form
    let username = document.getElementById('username').value
    let email1 = document.getElementById('email').value
    let email2 = document.getElementById('email2').value
    let password1 = document.getElementById('password').value
    let password2 = document.getElementById('password2').value
    
    // test user information for validity, and send errors from the top to the bottom of the form
    if (!usernamePattern.test(username)) {
        sendErrorToUser("Invalid username! Please ensure your name meets the criteria!")
        return false
    }
    else if (email1 != email2) {
        sendErrorToUser("Emails do not match! Please ensure you have typed you email correctly.")
        return false
    }
    else if (!emailPattern.test(email1)) {
        sendErrorToUser("Email invalid, please ensure your email is correct.")
        return false
    }
    else if (password1 != password2) {
        sendErrorToUser("Passwords do not match! Please retype your password.")
        return false
    }
    else if (!pwPattern.test(password1)) {
        sendErrorToUser("Password invalid, please ensure you have fulfilled the password creation criteria.")
        return false
    }
    // send request to database, redirect on success to login page
    else {
        let data = {
            'user': username, 
            'pass': password1,
            'email': email1
        }
                        
        const fetchOptions = { 
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        let response = await fetch('/api/createuser', fetchOptions)
        .then(function(response) {
            if (!response.ok) {
                sendErrorToUser("There's something wrong! I'm working on it.")
            }
            else {
                window.location.replace('login.html')
                alert("Account created! Please proceed to login")
            }
        })
        .catch(function(err) {
            console.log(err)
        })
    }
}

// Sends error to the user, in <p id=errorzone>
function sendErrorToUser(error) {
    console.log(error)
    let errorzone = document.getElementById('errorzone')
    errorzone.innerHTML = error
}

// Calls server to check username and password against database
// On success, adds userid/username to sessionstorage, and calls next function loggedin()
async function signIn() {
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    
    let data = {
        'user': username, 
        'pass': password
    }
    
    const fetchOptions = { 
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    
    let response = await fetch('/api/login', fetchOptions)
        .then(function(response) {
            response.text().then(function(text) {
                let data = JSON.parse(text)
                if (!data.ok) {
                    sendErrorToUser("Incorrect login information!")
                }
                else {
                    let id = data.userid
                    sessionStorage.setItem("id", id)
                    sessionStorage.setItem("username", username)
                    loggedIn()
                }
            })
        })
        .catch(function(err) {
            console.log(err)
        })
}

// After login, redirects to splash page
async function loggedIn() {
    let id = sessionStorage.getItem('id')
    if (id != undefined) {
        let data = {
            'id': id
        }
        const fetchOptions = {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch('/api/splash', fetchOptions)
        if (!response.ok) {
            console.log('Fetch request for /api/splash has failed.')
            return;
        }
        else {
            if (window.location != response.url) {
                window.location.assign(response.url)
            }
        }
    }
    else {
        window.location.assign('/')
    }
}

// Sign out - removes userid from session storage
async function signOut() {
    let id = sessionStorage.getItem('id')
    if (id != undefined) {
        sessionStorage.removeItem('id')
        sessionStorage.removeItem('username')
    }
    window.location.assign('/')
}

// Toggle classes which enable the top navigation bar to be put away
function toggleNavUpDown(e) {
    let nav = document.getElementById('nav')
    nav.classList.toggle('nav-up')
    let navButton = document.getElementById('navButton') 
    navButton.classList.toggle('rotate-180')
    let moveUpArray = []
    let header = document.getElementById('head')
    let content = document.getElementById('content')
    moveUpArray.push(header)
    moveUpArray.push(content)
    moveUpArray.forEach(function(pageArea) {
        pageArea.classList.toggle('moveUp')
    })
}

// Unhides/hides new module form from page
function unhideForm(e) {
    console.log("hide form")
    let form = document.getElementById('moduleForm')
    form.classList.toggle('hide')
}

// On load of main page, loads current data from database for user
async function loadUserData() {
    let userid = sessionStorage.getItem('id')
    
    let data = {
        'userid': userid
    }
    
    const fetchOptions = {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    
    const response = await fetch('/api/getusermodules', fetchOptions)
    .then(function(response) {
        response.text().then(function(text) {
            let modules = JSON.parse(text)
            modules.data.forEach(function(mod) {
                let title = mod.title
                let noSessions = mod.noSessions
                let description = mod.description
                addModuleToPage(title, noSessions, description)
            })
        })
    })
}

// Add an induvidual module to the main splash page - currently much too slow.
function addModuleToPage(title, noSessions, description) {
    let modZone = document.getElementById('modules')
    let _modData = document.createElement('p')
    let modData = modZone.appendChild(_modData)
    modData.innerHTML = title + " " + noSessions + " " + description
    modData.classList.add('module')
}

// Calls server to add module to database, then calls loadUserData() to update the page.
// TODO add input validation
async function addModule() {
    let title = document.getElementById('title').value
    let sessionCount = document.getElementById('sessionCount').value
    let desc = document.getElementById('desc').value
    let userid = sessionStorage.getItem('id')
    
    let data = {
        'userid': userid,
        'title': title,
        'sessionCount': sessionCount,
        'desc': desc
    }
    const fetchOptions = {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    
    const response = await fetch('/api/addmodule', fetchOptions)
    .then(function(response) {
        if (!response.ok) {
            sendErrorToUser("Oh no! Something has gone wrong!")
            console.log("error with /api/addmodule")
        }
        else {
            response.text().then(function(text) {
                let data = JSON.parse(text)
                if (!response.ok) {
                    console.log("Something is wrong with the return data from /api/module!")
                }
                else {
                    loadUserData()
                }
            })
        }
    })
    .catch(function(err) {
        sendErrorToUser("Oh no! Something has gone wrong!")
        console.log("error with /api/addmodule")
    })
}