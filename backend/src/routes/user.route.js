import express from 'express'
import { allusersController, searchuserController, signinController, signupController } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// router.route('/').post(signupController)
router.get('/',protect,allusersController)
router.get('/search',protect, searchuserController)
router.post('/',signupController)
router.post('/signin',signinController)
export default router