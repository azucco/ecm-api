import connection from '../my_modules/connection';


class User {
    constructor(id) {
        this.id = id;
    }
    
    getInfo() {
        return new Promise(resolve =>{
            connection
            .query(`SELECT u.username, u.mail, t.name as team FROM users u 
                    INNER JOIN teams t ON u.team = t.id
                    WHERE u.id = ${this.id}`)
            .then(result => {
                const data = result.rows[0]
                this.username = data.username
                this.mail = data.mail
                this.team = data.team
                resolve()
            })
        }) 
    }

    getStats() {
        return new Promise(resolve =>{
            connection
            .query(`SELECT COUNT(cu.id) as total, SUM(c.price) as amount FROM coffee_user cu
                    INNER JOIN coffees c ON cu.coffee = c.id
                    WHERE cu.user = ${this.id}`)
            .then(result => {
                this.stats = {
                    total: result.rows[0].total,
                    amount: result.rows[0].amount
                }
                resolve()
            })
        }) 
    }

    getCoffees() {
        return new Promise(resolve =>{
            connection
            .query(`SELECT cu.*, c.name FROM coffee_user cu
                    INNER JOIN coffees c ON cu.coffee = c.id
                    WHERE cu.user = ${this.id}`)
            .then(result => {
                const coffees = []
                result.rows.map(element => {
                    const coffee = {
                        name: element.name,
                        date: element.date
                    }
                    coffees.push(coffee)
                })
                this.coffees = coffees
                resolve()
            })
        }) 
    }

    getRank() {
        return new Promise(resolve =>{
            connection
            .query(`SELECT coffee_user.user, ROW_NUMBER () OVER (ORDER BY COUNT(*) desc)
                    FROM public.coffee_user
                    GROUP BY coffee_user.user`)
            .then(result=> {
                result.rows.map(element => {
                    if(element.user == this.id){
                        this.rank = element.row_number
                    }
                })
                resolve()
            })
        })
    }
}


export default User;