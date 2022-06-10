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
        res.status(200).send({ id: rows[0].id, name: rows[0].name, visitCount: visitsAmount, shortnedUrls: userShortUrls })
    } catch (error) {

        console.log("Error accessing the url.", error)
        res.status(500).send("Error accessing the url.")

    }
}

export async function openShortUrl(req, res){
    const { shortUrl } = req.params
    try {
        
        const rows = await db.query(
            `SELECT * FROM urls WHERE shortUrl = $1;`,
            [shortUrl]
        )	
        if (rows.rowCount > 0) {
            const rows = await db.query(
                `UPDATE urls SET visitCount = visitCount + 1 WHERE shortUrl = $1`,
                [shortUrl]
            )
            return res.redirect(rows[0].url)
        }else
            return res.status(404).send("There isn't a url with this id.")

    } catch (error) {

        console.log("Error openning the url.", error)
        res.status(500).send("Error openning the url.")

    }
}
