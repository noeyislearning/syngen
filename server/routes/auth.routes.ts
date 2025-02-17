import express from "express"
import { register, login, logout } from "../controllers/auth/"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", authenticate, logout)

export default router
