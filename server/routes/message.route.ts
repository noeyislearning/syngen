import express from "express"

import {
  sendMessageController,
  getMessagesController,
  sendSmsMessageController,
  getSmsMessagesController,
} from "../controllers"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/messages", authenticate, sendMessageController)
router.get("/messages", authenticate, getMessagesController)
router.post("/sms-messages", authenticate, sendSmsMessageController)
router.get("/sms-messages", authenticate, getSmsMessagesController)

export default router
