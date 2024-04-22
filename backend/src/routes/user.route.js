import express from 'express'
import { signinController, signupController } from '../controllers/user.controller.js'

const router = express.Router()

// router.route('/').post(signupController)
router.post('/',signupController)
router.post('/signin',signinController)
export default router