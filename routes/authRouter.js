import { Router } from "express"
import { validateSignUp, validateSignIn } from "../middlewares/authMiddleware.js"
import { signUp, signIn } from "../controllers/authController.js"

const authRouter = Router()

authRouter.post("/signup", validateSignUp, signUp)
authRouter.post("/signin", validateSignIn, signIn)

export default authRouter