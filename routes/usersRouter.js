import { Router } from "express"
import { getRanking, getUserData } from "../controllers/usersController.js"
import { validateToken } from "../middlewares/tokenMiddleware.js"


const usersRouter = Router()

usersRouter.get("/users/:id", validateToken, getUserData)
usersRouter.get("/ranking", getRanking)

export default usersRouter