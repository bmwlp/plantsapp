const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
const connection = mysql.createConnection(process.env.DATABASE_URL)
app.get('/', (req, res) => {
    res.send('Hello bimon, welcome to project')
})
app.get('/users', (req, res) => {
    connection.query(
        'SELECT * FROM users',
        function (err, results, fields) {
            res.send(results)
        }
    )
})
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    connection.query(
        'SELECT * FROM users WHERE id = ?', [id],
        function (err, results, fields) {
            res.send(results)
        }
    )
})
app.post('/users', (req, res) => {
    connection.query(
        'INSERT INTO `users` (`fname`, `lname`, `username`, `password`) VALUES (?, ?, ?, ?)',
        [req.body.fname, req.body.lname, req.body.username, req.body.password],
         function (err, results, fields) {
            if (err) {
                console.error('Error in POST /users:', err);
                res.status(500).send('Error adding user');
            } else {
                res.status(201).send(results);
            }
        }
    )
})
app.put('/users', (req, res) => {
    connection.query(
        'UPDATE `users` SET `fname`=?, `lname`=?, `username`=?, `password`=? WHERE id =?',
        [req.body.fname, req.body.lname, req.body.username, req.body.password, req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})
app.delete('/users', (req, res) => {
    connection.query(
        'DELETE FROM `users` WHERE id =?',
        [req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})

//login
app.post('/login', (req, res) => {
    connection.execute(
        'SELECT * FROM users WHERE username=? AND password=?',
        [req.body.username,req.body.password],
        function(err, results, fields) {
            if (err) {
                console.error('Error in POST /register:', err);
                res.status(500).send('Error Login');
            } else {
                res.status(200).send(results);
            }
        }
    );
});

app.put('/users/:username', (req, res) => {
    const { username } = req.params;
    const { fname, lname } = req.body;

    connection.execute(
        'UPDATE users SET fname = ?, lname = ? WHERE username = ?',
        [fname, lname, username],
        function(err, results, fields) {
            if (err) {
                console.error('Error in PUT /users/:username:', err);
                res.status(500).send('Error updating user');
            } else {
                res.status(200).send('User updated successfully');
            }
        }
    );
});







app.listen(process.env.PORT || 3000, () => {
    console.log(' 3000')
})
