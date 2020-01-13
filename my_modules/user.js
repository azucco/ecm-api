import connection from '../my_modules/connection';

export default class User {
    constructor(id) {
        this.id = id;
    } 
    
    getInfo() {
        return new Promise(resolve => {
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

    getStats(lastMonth = false) {
        const where = ``;
        if(lastMonth){
            where = ` AND cu.date >= date_trunc('month', current_date - interval '1' month)`;
        }
        return new Promise(resolve => {
            connection
            .query(`SELECT COUNT(cu.id) as total, SUM(c.price) as amount FROM coffee_user cu
                    INNER JOIN coffees c ON cu.coffee = c.id
                    WHERE cu.user = ${this.id}` + where)
            .then(result => {
                this.stats = {
                    total: result.rows[0].total,
                    amount: result.rows[0].amount
                }
                resolve()
            })
        }) 
    }

    getCoffees(lastMonth = false) {
        const where = ``;
        if(lastMonth){
            where = ` AND cu.date >= date_trunc('month', current_date - interval '1' month)`;
        }
        return new Promise(resolve => {
            connection
            .query(`SELECT cu.*, c.name FROM coffee_user cu
                    INNER JOIN coffees c ON cu.coffee = c.id
                    WHERE cu.user = ${this.id}` + where)
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

    getRank(lastMonth = false) {
        const where = ``;
        if(lastMonth){
            where = ` WHERE cu.date >= date_trunc('month', current_date - interval '1' month)`;
        }
        return new Promise(resolve => {
            connection
            .query(`SELECT coffee_user.user, RANK () OVER (ORDER BY COUNT(*) desc)
                    FROM public.coffee_user`
                    + where +
                    `GROUP BY coffee_user.user`)
            .then(result=> {
                result.rows.map(element => {
                    if(element.user == this.id){
                        this.rank = element.rank
                    }
                })
                resolve()
            })
        })
    }

    getRatio(lastMonth = false) {
        const where = ``;
        if(lastMonth){
            where = ` AND cu.date >= date_trunc('month', current_date - interval '1' month)`;
        }
        return new Promise(resolve =>{
            connection
            .query(`SELECT C.name, 
                            COUNT(*)::decimal/(
                                SELECT COUNT(*) FROM public.coffee_user CU WHERE CU.user = 10
                            )*100 as ratio 
                        FROM public.coffee_user CU
                        INNER JOIN public.coffees C ON CU.coffee = C.id
                        WHERE CU.user = 10`  + where +
                        `GROUP BY CU.coffee, C.name;`)
            .then(result => {
                const ratio = []
                result.rows.map(element => {
                    let coffee = {
                        name: element.name,
                        ratio: element.ratio
                    }
                    ratio.push(coffee)
                })
                this.ratio = ratio
                resolve()
            })
        })
    }
}