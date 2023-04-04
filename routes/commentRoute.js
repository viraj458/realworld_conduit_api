import express from 'express'
import { createComment } from '../controllers/commentController.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

//create a comment
router.post('/:slug/comments', auth,  createComment)

export default router