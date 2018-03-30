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
    
    console.log("step 1")
    
    // test user information for validity, and send errors from the top to the bottom of the form
    if (!usernamePattern.test(username)) {
        sendErrorToUser("Invalid username! Please ensure your name meets the criteria!")
        return false
    }
    else {
        console.log("step 2")
        if (email1 != email2) {
            sendErrorToUser("Emails do not match! Please ensure you have typed you email correctly.")
            return false
        }
        else {
            console.log("step 3")
            if (!emailPattern.test(email1)) {
                sendErrorToUser("Email invalid, please ensure your email is correct.")
                return false
            }
            else {
                console.log("step 4")
                if (password1 != password2) {
                    sendErrorToUser("Passwords do not match! Please retype your password.")
                    return false
                }
                else {
                    console.log("step 5")
                    if (!pwPattern.test(password1)) {
                        sendErrorToUser("Password invalid, please ensure you have fulfilled the password creation criteria.")
                        return false
                    }
                    else {
                        console.log("step 6")
                        let url = '/api/createuser'
                        
                        url += '?username=' + username
                        url += '&password=' + password1
                        url += '&email=' + email1
                        
                        console.log("before")
                        const fetchOptions = { method: 'POST' }
                        console.log("in between")
                        const response = await fetch(url, fetchOptions)
                        console.log("after")
                        console.log(response + " RESPONSE")
                        if (!response.ok) {
                            console.log("There's something wrong with /api/createuser!")
                            sendErrorToUser("Oops! Something went wrong, trust me, I'm working on it!");
                            return false
                        }
                        else {
                            console.log("Should be fine!");
                            window.location.replace('login.html')
                            return true
                        }
                    }
                }
            }
        }
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
    
    let url = '/api/login'
    
    url += '?username=' + username
    url += '&password=' + password
    const fetchOptions = { method: 'POST' }
    const response = await fetch(url, fetchOptions)
    
    console.log(response)
}