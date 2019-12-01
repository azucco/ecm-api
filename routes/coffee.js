import express from 'express';
import connection from '../my_modules/connection';

const router = express.Router();

const select = `SELECT c.name, c.price, COUNT(cu.*) as drinked FROM coffees c 
                INNER JOIN coffee_user cu ON c.id = cu.coffee
                GROUP BY c.id`

// Get all coffees
router.get('/coffee', function (req, res) {
    connection
    .query(select)
    .then(result => {
        const coffees = []
        result.rows.map(element => {
            const coffee = {
                name: element.name,
                price: element.price,
                drinked: element.drinked
            }
            coffees.push(coffee)

        })
        res.json(coffees);
    })
    .catch(e => console.error(e.stack))
})

router.post('/coffee/:id', function (req, res) {

    const id = req.params.id
    const user = req.body.user;

    const query = {
        text: 'INSERT INTO coffee_user (coffee, "user") VALUES ($1, $2) RETURNING *',
        values: [id, user]
      }
    connection
        .query(query)
        .then(result => {
            let json = {
                id: result.rows[0].id
            }
            res.json(json)
        })
        .catch(e => console.log(e.stack))

})

module.exports = router;