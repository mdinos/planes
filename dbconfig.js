const mysql = require('mysql')
const passwordHash = require('password-hash')
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'planesdb'
}

db = mysql.createConnection(dbOptions)

exports.db = db

// Initialises connection with the database
exports.connectDB = function() {
    db.connect(function(err) {
        if(err) {
            console.error('error connecting: ' + err.stack)
            return
        }
        else {
            console.log('Connected, ID is ' + db.threadId)
        }
    })
}

// Initialises the database information
exports.createDB = function() {
    db.query('CREATE DATABASE IF NOT EXISTS planesdb', function (err) {
        if (err) throw err;
        db.query('USE planesdb', function (err) {
            if (err) throw err;
            // Create users table
            db.query('CREATE TABLE IF NOT EXISTS users('
                + 'id INT NOT NULL AUTO_INCREMENT,'
                + 'PRIMARY KEY(id),'
                + 'username VARCHAR(30) NOT NULL,'
                + 'password VARCHAR(150) NOT NULL,'
                + 'email VARCHAR(150) NOT NULL'
                +  ') ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;', function (err) {
                if (err) {
                    console.log("Error:")
                    console.error(err)
                }
                else {
                     console.log("Successful users table creation query.")
                }
            })
            // Create modules table - FKey is id from users table
            db.query('CREATE TABLE IF NOT EXISTS modules('
                + 'modId INT NOT NULL AUTO_INCREMENT, '
                + 'userId INT NOT NULL, '
                + 'title VARCHAR(50) NOT NULL, '
                + 'description VARCHAR(150), '
                + 'noSessions INT, '
                + 'PRIMARY KEY(modId), '
                + 'FOREIGN KEY(userid) REFERENCES users(id) '
                + ') ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;', function(err) {
                if (err) {
                    console.log("Error creating modules table: ")
                    console.error(err)
                }
                else {
                    console.log("Successful modules table creation query.")
                }
            })
            // TODO: More secure sessions with random userids implemented, check sessions against database, with timeout feature, so if a request to page is made and the time stored in the database is >= 1 day ago, make login again. To ensure that the person is logged in and not just someone who changed their session storage.
            /*db.query('CREATE TABLE IF NOT EXISTS sessions('
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
            })*/
        })
    })
}

// Verifies login details with database, returns user data in callback
exports.checkUserLogin = function(username, password, callback) {
    db.query('SELECT * FROM users WHERE username = "' 
             + username + '"', function (err, results) {
        let response = {}
        if (err) {
            console.error(err)
            response.ok = false
        }
        else if (results == []) {
            console.log("User does not exist")
            response.ok = false
        }
        else if (!passwordHash.verify(password, results[0].password)) {
            console.log("password wrong")
            response.ok = false
        }
        else {
            let userid = results[0].id
            response.ok = true
            response.userid = userid
        }
        callback(response)
    })
}

// Creates a user and adds to the database
exports.createUser = function(username, password, email) {
    db.query('INSERT INTO users (username, password, email) VALUES ("' 
             + username + '", "' 
             + password + '", "' 
             + email + '")', function (err) {
        if (err) {
            console.log("Error inserting user data into table 'users'.")
            console.error(err)
        }
        else {
            console.log("User created: " + username)
        }
    })
}

// Checks if a user exists
exports.checkUser = function(userid, callback) {
    db.query('SELECT * FROM users WHERE id = ' 
             + userid + ';', function(err, results) {
        let response = {}
        if (err) {
            console.error(err)
            response.ok = false
        }
        else if (results == []) {
            console.log("User does not exist")
            response.ok = false
        }
        else {
            response.ok = true
        }
        callback(response)
    })
}

// Creates new module with userid and title completed, returns modId in callback
exports.createModule = function(userid, title, callback) {
    db.query('INSERT INTO modules (userId, title) VALUES ("'
             + userid + '", "'
             + title + '")', function(err, results) {
        let response = {}
        if (err) {
            console.log("Error inserting mdule data into table 'modules'.")
            console.error(err)
            response.ok = false;
        }
        else {
            console.log("Module created: " + title)
            response.ok = true;
            response.modId = results.insertId
        }
        callback(response)
    })
}

// Updates module description field
exports.updateModuleDescription = function(modId, description) {
    db.query('UPDATE modules SET description = "'
             + description + '" WHERE modId = '
             + modId + ';', function(err) {
        if (err) {
            console.log("Error updating module description.")
            console.error(err)
        }
        else {
            console.log("Description for module updated.")
        }
    })
}

// Updates module noSessions field
exports.updateModuleSessionCount = function(modId, sessionCount) {
    db.query('UPDATE modules SET noSessions = '
             + sessionCount + ' WHERE modId = '
             + modId + ';', function(err) {
        if (err) {
            console.log("Error updating module sessions.")
            console.error(err)
        }
        else {
            console.log("Number of sessions updated")
        }
    })
}

// Retrieves modules from database from specific user
exports.getUsersModules = function(userid, callback) {
    db.query('SELECT * FROM modules WHERE userId = '
             + userid + ';', function(err, results) {
        let response = {}
        if (err) {
            console.error(err)
            response.ok = false
        }
        else if (results == []) {
            console.log("No modules found.")
            response.ok = true
        }
        else {
            response.ok = true
            response.data = results;
        }
        callback(response)
    })
}