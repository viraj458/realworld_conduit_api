import express from 'express'
import { createArticle, deleteArticle, getAllArticles } from '../controllers/articleController.js'
import auth from '../middlewares/auth.js'


const router = express.Router()

//create an article
router.post('/', auth, createArticle)

//create an article
router.get('/', getAllArticles)

//delete an article
router.delete('/:slug', auth, deleteArticle)

export default router