const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
const connection = mysql.createConnection(process.env.DATABASE_URL)
app.get('/', (req, res) => {
    res.send('Hello baimon!!')
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


app.get('/models', (req, res) => {
    connection.query(
        'SELECT * FROM models',
        function (err, results, fields) {
            res.send(results)
        }
    )
})


app.get('/models/:id', (req, res) => {
    const id = req.params.id; 
    connection.query(
        'SELECT * FROM models WHERE plantid = ?',
        [id], 
        function (err, results, fields) {
            if (err) {
               
                console.error('Error retrieving data:', err);
                res.status(500).send('Internal Server Error');
            } else {
               
                res.status(200).send(results);
            }
        }
    );
});



// เส้นทาง GET สำหรับการดึงข้อมูลทั้งหมดจากตาราง 'fav'
app.get('/favourite', (req, res) => {
    connection.query(
        'SELECT * FROM fav',
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching favourites:', err);
                res.status(500).json({ error: 'Error fetching favourites' });
                return;
            }
            res.json(results);
        }
    )
})

app.post('/favourite', (req, res) => {
    const { plantId } = req.body;
    connection.query(
        'INSERT INTO fav (plantId) VALUES (?)',
        [plantId],
        function (err, results, fields) {
            if (err) {
                console.error('Error adding favourite:', err);
                res.status(500).json({ error: 'Error adding favourite' });
                return;
            }
            res.status(201).json({ message: 'Favourite added successfully' });
        }
    )
})

app.listen(process.env.PORT || 3000, () => {
    console.log(' 3000')
})
