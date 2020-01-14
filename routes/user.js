import express from 'express';
import connection from '../my_modules/connection';
import User from '../my_modules/user';

const router = express.Router();

const select = `SELECT u.username, u.mail, t.name as team FROM users u 
                INNER JOIN teams t ON u.team = t.id`

// Get all users
router.get('/users', function (req, res) {
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


router.get('/users/:id', function (req, res) {
    const id = req.params.id
    const user = new User(id)
    
    sendResponse()

    async function sendResponse(){
        try {
            await user.getInfo()
        } catch(err) {
            console.error(err)
        } 
        res.json(user)
    }
})

router.get('/users/consumptions/:id', function (req, res) {
    const id = req.params.id
    const user = new User(id)
    
    sendResponse()

    async function sendResponse(){
        try {
            await user.getStats()
            await user.getCoffees()
            await user.getRank()
            await user.getRatio()
            await user.getCoffeeDiary()
        } catch(err) {
            console.error(err)
        } 
        res.json(user)
    }
})

router.get('/users/consumptions/month/:id', function (req, res) {
    const id = req.params.id
    const user = new User(id)
    const lastMonth = true;
    
    sendResponse()

    async function sendResponse(){
        try {
            await user.getStats(lastMonth)
            await user.getCoffees(lastMonth)
            await user.getRank(lastMonth)
            await user.getRatio(lastMonth)
            await user.getCoffeeDiary(lastMonth)
        } catch(err) {
            console.error(err)
        } 
        res.json(user)
    }
})


module.exports = router;