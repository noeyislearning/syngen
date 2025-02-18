import express from "express"
import { loginController, logoutController } from "../controllers"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/login", loginController)
router.post("/logout", authenticate, logoutController)

export default router
