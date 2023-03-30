import db from '../db.js'

//get current user
export const getCurrentUser = async(req, res) => {
    try {
        const {authorization} = req.headers
        const token = authorization.split(' ')[1]

        const {id} = req.user
        const user = await db('users').where({id}).first()
        // console.log(token);
        
        res.status(200).json({user:{email: user.email, token, username: user.username }})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}