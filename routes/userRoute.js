import express from 'express'
import { getCurrentUser } from '../controllers/userController.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

//get a user
router.get('/', auth, getCurrentUser )

export default router