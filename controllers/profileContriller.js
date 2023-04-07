import db from '../db.js'

export const getProfile = async(req, res) => {
    
    try {
        const {username} = req.params

        if(!username){
            return res.status(404).json("user doesn't exist")
        }
        const profile = await db('users').where({username}).select('*').first()
        console.log(profile);

        res.status(200).json({profile:{
            username: profile.username,
            bio: profile.bio,
            image: profile.image,
            following: false
        }})

    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const followProfile = async(req, res) => {

}

export const unfollowProfile = async(req, res) => {

}