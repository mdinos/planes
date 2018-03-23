function createAccount() {
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
    
    // test user information for validity
    if (!usernamePattern.test(username)) {
        sendErrorToUser("Invalid username! Please ensure your name meets the criteria!")
    }
    else {
        console.log("username valid")
        if (email1 != email2) {
            sendErrorToUser("Emails do not match! Please ensure you have typed you email correctly.")
        }
        else {
            if (!emailPattern.test(email1)) {
                sendErrorToUser("Email invalid, please ensure your email is correct.")
            }
            else {
                console.log("email ok")
                if (password1 != password2) {
                    sendErrorToUser("Passwords do not match! Please retype your password.")
                }
                else {
                    if (pwPattern.test(password1)) {
                        console.log(password1);
                    }
                    else {
                        sendErrorToUser("Password invalid, please ensure you have fulfilled the password creation criteria.")
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