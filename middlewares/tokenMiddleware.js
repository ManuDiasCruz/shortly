import db from "./../db.js"


export async function validateToken(req, res, next){
    if (!req.headers.authorization) {
        return res.status(401).send("No authorization header.");
    }
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer", "").trim()
    console.log(token)

    if (!token) return res.status(401).send("No token.")

    try {
        
        const session = await db.query(
            `SELECT * FROM sessions WHERE TOKEN=$1`,
            [token]
        )
        if (!session) return res.status(401).send("No session.")

        console.log(session[0].userId)

        res.locals.userId = session[0].userId

        next()

    } catch (error) {
        console.log("Error checking token.", error)
        res.status(500).send("Error checking token.")
    }
}

