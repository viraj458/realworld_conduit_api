import express from "express";
import { favouriteArticle, unFavouriteArticle } from "../controllers/favouriteController.js";
import auth from '../middlewares/auth.js'

const router = express.Router()

//favourite route
router.post('/:slug/favorite', auth, favouriteArticle)

//unfavourite route
router.delete('/:slug/favorite', auth, unFavouriteArticle)

export default router