import express from 'express';
import connection from '../my_modules/connection';

const router = express.Router();

const select = `SELECT u.username, u.mail, t.name as team FROM users u 
                INNER JOIN teams t ON u.team = t.id
                
                `
                /* LEFT JOIN coffee_user cu ON u.id = cu.user */

// Get all users
router.get('/user', function(req, res) {
    
    connection
        .query(select)
        .then(result => {
            const users = []
            result.rows.map(element => {
                const user = {
                    name: element.username,
                    mail: element.mail,
                    team: element.team
                }
                users.push(user)
               
            })
            res.json(users);
        })
        .catch(e => console.error(e.stack))
});

// Get user
router.get('/user/:id', function(req, res) {
  
    const id = req.params.id
    
    connection
        .query(select + `WHERE u.id = ${id}`)
        .then(result => {
            const data = result.rows[0]
            const coffees = []
            
            connection
                .query(`SELECT cu.*, c.name FROM coffee_user cu
                        INNER JOIN coffees c ON cu.coffee = c.id
                        WHERE cu.user = ${id}`)
                .then(result =>{
                    
                    result.rows.map(element => {
                        const coffee = {
                            name: element.name,
                            date: element.date
                        }
                    coffees.push(coffee)
                    })

                    const user = {
                        name: data.username,
                        mail: data.mail,
                        team: data.team,
                        coffees: coffees
                    }
                        
                    res.json(user);
                })  
        })
        .catch(e => console.error(e.stack))
});

module.exports = router;