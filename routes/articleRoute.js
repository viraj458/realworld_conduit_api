import express from 'express'
import { createArticle, deleteArticle, feedArticle, getAllArticles, getArticle, updateArticle } from '../controllers/articleController.js'
import auth from '../middlewares/auth.js'
import authOptional from '../middlewares/authOptional.js'


const router = express.Router()

//create an article
router.post('/', auth, createArticle)

//article feed, must define before '/:slug' route otherwise feed will consider as slug part
router.get('/feed', auth, feedArticle)

//create an article
router.get('/:slug', auth, getArticle)

//delete an article
router.delete('/:slug', auth, deleteArticle)

//get all articles
router.get('/', authOptional, getAllArticles)

//update a article
router.put('/:slug', auth, updateArticle)



export default router