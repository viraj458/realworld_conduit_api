import express from 'express'
import { createArticle } from '../controllers/articleController.js'
import auth from '../middlewares/auth.js'


const router = express.Router()

//create an article
router.post('/', auth,  createArticle)

export default router