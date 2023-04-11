import db from '../db.js'

//get current user
export const getCurrentUser = async(req, res) => {
    try {
        const {authorization} = req.headers
        const token = authorization.split(' ')[1]

        const {id} = req.user
        const user = await db('users').where({id}).first()
        // console.log(token);

        res.status(200).json({
            user:{
                email: user.email, 
                token, username: user.username, 
                bio: user.bio, 
                image: user.image 
            }})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

//update user
export const updateUser = async(req, res) => {
    try {
        const {authorization} = req.headers
        const token = authorization.split(' ')[1]
        const {id} = req.user

        await db('users').where({ id }).update({...req.body.user})
        const [updatedUser] = await db('users').select('*').where({id})
        // console.log(updatedUser);

        res.status(200).json({
            user:{
                email: updatedUser.email, 
                username: updatedUser.username, 
                token,
                bio: updatedUser.bio,
                image: updatedUser.image
            }})
        
    } catch (err) {
        res.status(200).json({error: err.message})
    }
}