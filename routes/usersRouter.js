import { Router } from "express"
import { getRanking, getUserData } from "../controllers/usersController"
import { validateToken } from "../middlewares/tokenMiddleware"


const usersRouter = Router()

usersRouter.get("/users/:id", validateToken, getUserData)
usersRouter.get("/ranking", getRanking)

export default usersRouter