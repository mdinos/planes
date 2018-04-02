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
                console.log("user created: " + username)
                window.location.replace('login.html')
                alert("Account created! Please proceed to login")
            }
        })
        .catch(function(err) {
            console.log(err)
        })
    }
}

function sendErrorToUser(error) {
    console.log(error)
    let errorzone = document.getElementById('errorzone')
    errorzone.innerHTML = error
}

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
                    loggedIn()
                }
            })
        })
        .catch(function(err) {
            console.log(err)
        })
}

async function loggedIn() {
    if (sessionStorage.getItem("id") != undefined) {
        console.log("hello")
    }
}