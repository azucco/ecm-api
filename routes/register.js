const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const connection = require('../my_modules/connection');
const tokenManager = require('../my_modules/tokenManager');

/* GET home page. */
router.post('/register', function(req, res, next) {
    
    const username = req.body.username;
    const mail = req.body.mail;
    const password = req.body.password;

    const findUniqueKey = function() {
        return new Promise(resolve => {
            connection.query(`SELECT COUNT(*) as count FROM users WHERE username = '${username}' OR mail = '${mail}'`, function(err, result) {
                if (err) throw err;
                if(result.rows[0].count > 0){
                    resolve(true);
                }
                resolve(false);
            });
        })
    }

    const insertUser = function() {
        return new Promise(resolve => {
            bcrypt.genSalt(10, (err, salt) => {
                if(err) throw err;
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    const query = {
                        text: 'INSERT INTO users (username, mail, pw) VALUES ($1, $2, $3) RETURNING *',
                        values: [username, mail, hash],
                      }
                    connection
                        .query(query)
                        .then(result => resolve(result.rows[0].id))
                        .catch(e => console.log(e.stack))
                });
            });
        })
    }

    const registerUser = async function () {

        let json = {
            message: "Registration failed: missing field/fields",
            token: ""
            };
            
        if(username != undefined && password != undefined && mail != undefined && username != '' && password != '' && mail != ''){
            try {
                const check = await findUniqueKey();
                if(!check){
                    let id = await insertUser();
                    const token = await tokenManager.createToken(id);
                    json.message = `User regsitered.`;
                    console.log("token: " + token)
                    json.token = token;
                   
                }else{
                    json.message = `Registration failed: username and/or mail already used.`;
                }
            } catch (err) {
                json.message = `Problem during registration, try later.`;
            }
        }
        res.json(json);
    }

    registerUser();
});

module.exports = router;