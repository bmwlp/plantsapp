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

app.put('/repass' , (req,res) => {
    connection.query(
        'UPDATE users SET  `password` = ?  WHERE username = ?',
        [req.body.password,req.body.username],
        function (err, results, fields){
            if(err){
                console.error('Error in Put /register: ', err);
                res.status(500).send('Error update password')
            }else{
                res.status(201).send(results)
            }
        }
    )
});

app.delete('/userdel', (req, res) => {
    connection.query(
        'DELETE FROM `users` WHERE username =?',
        [req.body.username],
         function (err, results, fields) {
            res.send(results)
        }
    )
})




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
app.get('/favourite/get', (req, res) => {
    connection.query(
        'SELECT * FROM fav ',
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

app.get('/favourite/select', (req, res) => {
    connection.query(
      'SELECT fav.favid, models.plantName, models.price, models.pic, models.category FROM fav INNER JOIN models ON fav.plantid = models.plantid',
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
  

    app.get('/detailfav/:id', (req, res) => {
        const id = req.params.id; 
        connection.query(
            'SELECT models.plantName, models.price, models.pic, models.category FROM models INNER JOIN fav ON fav.plantid = models.plantid WHERE models.plantid = ?',
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
    
    
    
    app.post('/favourite/add', (req, res) => {
        const { plantId } = req.body;
        connection.query(
            'INSERT INTO fav (plantid) VALUES (?)',
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

    
    //delete
app.delete('/favourite', (req, res) => {
    connection.query(
        'DELETE FROM `Favourite` WHERE id =?',
        [req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})

app.delete('/favdel/:id', async (req, res) => {
    const id = req.params.id;
    connection.query(
        'DELETE FROM `fav` WHERE id = ?',
        [id],
        function (err, results, fields) {
            res.send(results)
        }
    );
});

app.delete('/favdel/:id', async (req, res) => {
    const id = req.params.id;
    connection.query(
        'DELETE FROM `fav` WHERE id = ?',
        [id],
        function (err, results, fields) {
            if (err) {
                console.log(err);
                res.status(500).send({ status: 'error', message: 'Error deleting record' });
            } else {
                if (results.affectedRows == 0) {
                    res.status(404).send({ status: 'not found', message: 'Record not found' });
                } else {
                    res.send({ status: 'success', message: 'Record deleted successfully' });
                }
            }
        }
    );
});

app.delete('/favourite', (req, res) => {
    connection.query(
        'DELETE FROM `fav` WHERE id =?',
        [req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})


    

    app.get('/cart/get', (req, res) => {
        connection.query(
            'SELECT * FROM cart ',
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

    app.post('/cart/add', (req, res) => {
        const { plantId } = req.body;
        connection.query(
            'INSERT INTO cart (plantid) VALUES (?)',
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

    app.get('/cart/select', (req, res) => {
        connection.query(
            'SELECT models.plantName, models.price, models.pic, models.category FROM cart INNER JOIN models ON cart.plantid = models.plantid',
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

    app.delete('/delcart/:id', async (req, res) => {
        const id = req.params.id;
        connection.query(
            'DELETE FROM `cart` WHERE id = ?',
            [id],
            function (err, results, fields) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรายการโปรด' });
                    return;
                }
                res.json({ message: `รายการโปรดที่มี id ${id} ถูกลบสำเร็จ` });
            }
        );
    });

app.listen(process.env.PORT || 3000, () => {
    console.log(' 3000')
})
