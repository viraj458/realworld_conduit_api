import express from 'express'
import { getCurrentUser, updateUser } from '../controllers/userController.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

//get a user
router.get('/', auth, getCurrentUser )

//update user
router.put('/', auth, updateUser)

export default router