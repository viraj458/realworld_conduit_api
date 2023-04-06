import express from 'express'
import { createComment, deleteComment, getAllComments } from '../controllers/commentController.js'
import auth from '../middlewares/auth.js'
import authOptional from '../middlewares/authOptional.js'

const router = express.Router()

//add a comment
router.post('/:slug/comments', auth,  createComment)

//get all comments without auth
router.get('/:slug/comments', authOptional, getAllComments)

//delete a comment 
router.delete('/:slug/comments/:commentid', auth,  deleteComment)

export default router