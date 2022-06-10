import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"

import db from "./../db.js"

export async function signUp(req, res){
    const {name, email, password, repeatedPassword} = req.body
    try {
        // There is already a registered user with this email
        const user = await db.query(
            `SELECT * FROM users WHERE email = $1;`,
            [email]
        )		
        if (user.rowCount > 0) 
            return res.status(409).send(`There is already a user with this email: ${email}.`)
    
        // Inserting the user
        const SALT = 10
        const encryptedPassword = bcrypt.hashSync(password, SALT)
        await db.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
            [name, email, encryptedPassword]
        )
        res.status(201).send('User was Created at DB >> users table.')
        console.log("created")

    } catch (error) {

        console.log("Error creating new user.", error)
        res.status(500).send("Error creatig new user.")

    }
}

export async function signIn(req, res){
    const {email, password} = req.body

    try {

        const user = await db.query(
            `SELECT * FROM users WHERE email = $1;`,
            [email]
        )		
        if (!user) 
            return res.status(404).send(`There isn't a user with this email: ${email}.`)

        if (!bcrypt.compareSync(password, user[0].password)){
            return res.status(401).send(`Wrong password.`)
        }

        const token = uuid()
        await db.query(
            `INSERT INTO sessions (userId, token) VALUES ($1, $2)`,
            [user[0]._id, token]
        )
        res.locals.user = user._id
        return res.status(201).send(token)

    } catch (error) {

        console.log("Error logging in user.", error)
        res.status(500).send("Error logging in user.")
        
    }
}

export async function signOut(req, res) {
    const {authorization} = req.headers

    const token = authorization?.replace("Bearer", "").trim()
    if(!token) return res.send(403) // forbidden
    
    try {
        await db.collection("sessions").deleteOne({token})

        res.sendStatus(200)

    } catch (error) {
        console.log("Error logging out.", error)
        return res.status(500).send("Error logging out.")
    }
}