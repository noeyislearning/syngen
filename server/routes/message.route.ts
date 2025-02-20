import express from "express"

import { sendMessageController, getMessagesController } from "../controllers"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/messages", authenticate, sendMessageController)
router.get("/messages", authenticate, getMessagesController)

export default router
