import express from 'express'
import { createArticle, deleteArticle, getAllArticles, getArticle, updateArticle } from '../controllers/articleController.js'
import auth from '../middlewares/auth.js'


const router = express.Router()

//create an article
router.post('/', auth, createArticle)

//create an article
router.get('/:slug', auth, getArticle)

//delete an article
router.delete('/:slug', auth, deleteArticle)

//get all articles
router.get('/', getAllArticles)

//update a article
router.put('/:slug', auth, updateArticle)

export default router