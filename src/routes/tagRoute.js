import express from 'express'
import { getAllTags } from '../controllers/tagController.js'

const router = express.Router()

//get all tags
router.get('/', getAllTags)

export default router