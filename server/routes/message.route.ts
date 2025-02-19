import express from "express"

import { sendMessageController } from "../controllers/message/send-message.controller"
import { getMessagesController } from "../controllers/message/get-messages.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/messages", authenticate, sendMessageController)
router.get("/messages", authenticate, getMessagesController)

export default router
