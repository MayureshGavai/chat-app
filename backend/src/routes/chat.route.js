import express from "express"
import { protect } from "../middleware/auth.middleware.js"
import { accesschatController, addtogroupController, creategroupController, fetchchatsController, removefromgroupController, renamegroupController } from "../controllers/chat.controller.js"

const router = express.Router()

router.post('/',protect,accesschatController)
router.get('/',protect,fetchchatsController)
router.post('/group',protect,creategroupController)
router.put('/rename',protect,renamegroupController)
router.put('/groupremove',protect,removefromgroupController)
router.put('/groupadd',protect,addtogroupController)

export default router