import express from 'express'
import auth from '../middlewares/auth.js'
import { followProfile, getProfile, unfollowProfile } from '../controllers/profileContriller.js'

const router = express.Router()


//get profile
router.get('/:username', auth, getProfile)

//follow profile
router.post('/:username/follow', auth, followProfile)

//unfollow profile
router.delete('/:username/follow', auth, unfollowProfile)


export default router