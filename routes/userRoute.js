import express from 'express'
import { signupUser } from '../controllers/userController.js'

const router = express.Router()


//signup route
router.post('/', signupUser)


export default router