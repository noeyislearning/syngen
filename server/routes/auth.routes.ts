import express from "express"
import { registerController, loginController, logoutController } from "../controllers/auth/"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/register", registerController)
router.post("/login", loginController)
router.post("/logout", authenticate, logoutController)

export default router
