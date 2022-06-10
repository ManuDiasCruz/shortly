import { Router } from "express"
import { getUserData } from "../controllers/usersController"
import { validateToken } from "../middlewares/tokenMiddleware"


const usersRouter = Router()

usersRouter.get("/users/:id", validateToken, getUserData)

export default usersRouter