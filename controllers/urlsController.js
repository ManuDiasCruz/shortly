import { nanoid } from "nanoid"
import db from "./../db.js"

export async function createShortUrl(req, res){
    const { url } = req.body
    const { userId } = res.locals

    console.log(userId)

    try {
        // This url is already registered
        const query = await db.query(
            `SELECT * FROM urls WHERE url = $1;`,
            [url]
        )	
        if (query.rowCount > 0) 
            return res.status(409).send(`There url is already registered.`)

        // Inserting the url
        const shortUrl = nanoid(8)
        await db.query(
            `INSERT INTO urls (userId, url, shortUrl, visitCount) VALUES ($1, $2, $3, $4)`,
            [userId, url, shortUrl, 0]
        )
        res.status(201).send(shortUrl)
        console.log("created")

    } catch (error) {

        console.log("Error creating new short url.", error)
        res.status(500).send("Error creatig new short url.")

    }
}

export async function getUrlById(req, res){
    const { id } = req.params
    try {
        
        const rows = await db.query(
            `SELECT * FROM urls WHERE id = $1;`,
            [id]
        )	
        console.log(rows.rows[0])
        if (rows.rowCount > 0) 
            return res.status(200).send(rows[0])
        else
            return res.status(404).send("There isn't a url with this id.")

    } catch (error) {

        console.log("Error accessing the url.", error)
        res.status(500).send("Error accessing the url.")

    }
}

export async function openShortUrl(req, res){
    console.log("openShortUrl")
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

export async function deleteUrl(req, res){
    console.log("deleteUrl")
    const { id } = req.params
    const { userId } = res.locals

    try {
        
        const rows = await db.query(
            `SELECT * FROM urls WHERE id = $1;`,
            [id]
        )
        console.log(rows.rows[0])
        if (rows.rowCount > 0){
            if (rows[0].userId == userId){
                await db.query(
                    `DELETE FROM urls WHERE id = $1;`,
                    [id]
                )	
                return res.status(204).send(`${rows[0].url} deleted!`)
            }else{
                return res.status(401).send(`You aren't authorized to delete the ${rows[0].url}!`)
            }
        }else{
            return res.status(404).send("There isn't a url with this id.")
        }

    } catch (error) {

        console.log("Error deleting the url.", error)
        res.status(500).send("Error deleting the url.")

    }

}