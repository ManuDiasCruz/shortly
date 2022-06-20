import { Router } from "express"
import { createShortUrl, deleteUrl, getUrlById, openShortUrl } from "../controllers/urlsController.js"
import { validateToken } from "../middlewares/tokenMiddleware.js"


const urlsRouter = Router()

urlsRouter.post("/urls/shorten", validateToken, createShortUrl)
urlsRouter.get("/urls/:id", getUrlById)
urlsRouter.get("/urls/open/:shortUrl", openShortUrl)
urlsRouter.delete("/urls/:id", validateToken, deleteUrl)

export default urlsRouter