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
    try {

        const {id} = req.user
        const {username} = req.params


        const user = await db('users').where({username}).select('*').first()
        const user_id = user.id
        // console.log(user_id);

        if(id===user_id){
            return res.status(401).json("denied")
        }

        await db('followers').insert({follower_user_id: id, following_user_id: user_id})

        res.status(200).json({profile:{
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: true
        }})

    } catch (err) {
        res.status(400).json({error: err.message})
    }
    
}

export const unfollowProfile = async(req, res) => {
    try {
        const {id} = req.user
        const {username} = req.params

        const user = await db('users').where({username}).select('*').first()
        const user_id = user.id

        if(id===user_id){
            return res.status(401).json("denied")
        }
        const exist = await db('followers').where({follower_user_id: id}).andWhere({following_user_id: user_id}).first()
        if(!exist){
            return res.status(404).json("user not followed")
        }
        

        
        await db('followers').where({follower_user_id: id}).andWhere({following_user_id: user_id}).first().del()
        

        res.status(200).json({profile:{
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: false
        }})

    } catch (err) {
        res.status(400).json({error: err.message})
    }
}