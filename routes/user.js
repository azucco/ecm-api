const express = require('express');
const router = express.Router();
const connection = require('../my_modules/connection');

// Get all users
router.get('/user', function(req, res) {
    console.log(req.payload)
    connection
        .query('SELECT * FROM users')
        .then(result => {
            let users = {};
            result.rows.map(element => {
                users[element.id] = element.username
            })
            res.json(users);
        })
        .catch(e => console.error(e.stack))
});

// Add user (register)
router.post('/user', function(req, res, next) {
    res.end(JSON.stringify(req.body, null, 2))

});


// Get all users
router.get('/user/:id', function(req, res, next) {
  
    connection.query(`SELECT * FROM users WHERE id = ${req.params.id}`, function(err, rows, fields) {
        if (err) throw err;
        res.json(rows[0].username);
        console.log(req.headers.authorization);
    });
});

module.exports = router;