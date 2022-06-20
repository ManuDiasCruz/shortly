import db from "./../db.js"

export async function getUserData(req, res){
    const { id } = req.params
    try {
        
        const rows = await db.query(
            `SELECT * FROM users WHERE id = $1;`,
            [id]
        )	
        if (!rows) 
            return res.status(404).send(`There isn't a user with id = ${id}.`)
        
        const userShortUrls = await db.query(
            `SELECT * FROM urls WHERE userId = $1;`,
            [id]
        )
        const visitsAmount = await db.query(
            `SELECT SUM (visitCount) FROM urls WHERE userId = $1;`,
            [id]
        )
        console.log(rows.rows[0].id, rows.rows[0].name, visitsAmount, userShortUrls)
        res.status(200).send({ id: rows.rows[0].id, name: rows.rows[0].name, visitCount: visitsAmount, shortnedUrls: userShortUrls })
    } catch (error) {

        console.log("Error getting user data.", error)
        res.status(500).send("Error getting user data.")

    }
}

export async function getRanking(req, res){

    try {
        
        const rows = await db.query(
            `SELECT u.id, 
                    u.name,
                    COUNT (l.userid) as linksCount, 
                    COALESCE ( SUM (l.visitCount)) as visitCount
            FROM users u, urls l
            WHERE u.id = l.userid
            GROUP BY u.id
            ORDER BY visitcount DESC LIMIT 10;`
        )	
        if (!rows) 
            return res.status(404).send(`There isn't data at users table.`)
        
        res.status(200).send(rows)
    } catch (error) {

        console.log("Error getting ranking data.", error)
        res.status(500).send("Error getting ranking data.")

    }
}
