import express from 'express'
import { loginUser, signupUser } from '../controllers/authController.js'
import auth from '../middlewares/auth.js'

const router = express.Router()


//signup route
router.post('/', signupUser)

//login route
router.post('/login', loginUser)



export default router