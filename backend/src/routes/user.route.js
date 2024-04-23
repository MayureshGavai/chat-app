import express from 'express'
import { alluserController, signinController, signupController } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// router.route('/').post(signupController)
router.get('/',protect, alluserController)
router.post('/',signupController)
router.post('/signin',signinController)
export default router