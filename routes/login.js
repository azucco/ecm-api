import express from 'express';
import bcrypt from 'bcryptjs';
import connection from '../my_modules/connection';
import tokenManager from '../my_modules/tokenManager';

const router = express.Router();

router.post('/login', function(req, res, next) {
    
    const username = req.body.username;
    const password = req.body.password;

    function findUser() {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM users WHERE username = '${username}'`, function(err, result) {
                if (err) throw err;
                resolve(result);
            });
        })
    }

    function checkCredentials(hash) {
        return new Promise(resolve => {
            bcrypt.compare(password, hash, (err, res) => {
                if (err) throw err;
                resolve(res);
            });
        })
    }

    async function login() {
        let json = {
                    message: "Login failed: missing field/fields",
                    token: ""
                    };
        try {
            const result = await findUser();
            const user = result.rows[0];
            if(username != undefined && password != undefined && username != '' && password != ''){
                if(user != undefined){
                    const check = await checkCredentials(user.pw);
                    if(check === true){
                        const token = await tokenManager.createToken(user.id);
                        if(token){
                            json.message = `User logged.`;
                            json.token = token;
                        }else{
                            json.message = `Problem during authentication, try later.`;
                        }  
                    }else{
                        json.message = "Login failed: wrong credentials"; // wrong password
                    };
                }else{
                    json.message = "Login failed: wrong credentials"; // wrong username
                }
            }

        } catch (err) {
            console.log(err);
            json.message = `Problem during authentication, try later.`;
        }
        res.json(json);
    }

    login();
    
});

module.exports = router;