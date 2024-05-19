import express from "express"
import { protect } from "../middleware/auth.middleware.js"
import { allMessagesController, sendMessageController } from "../controllers/message.controller.js"

const router = express.Router()

router.post('/',protect,sendMessageController)
router.get('/:chatId',protect,allMessagesController)

export default router