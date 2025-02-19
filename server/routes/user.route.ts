import express from "express"

import { registerController, getUserProfileController } from "../controllers"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/register", registerController)
router.get("/profile", authenticate, getUserProfileController)

export default router
