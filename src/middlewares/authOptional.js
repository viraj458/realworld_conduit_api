import jwt from 'jsonwebtoken'
import db from '../db.js'

const authOptional = async(req, res, next) => {
    //verify user is authenticated
    const {authorization} = req.headers

    if(!authorization){
        return next()
    }

    const token = authorization.split(' ')[1]

    try {
        const {id} = jwt.verify(token, process.env.SECRET)

        req.user = await db('users').where({id}).select('id').first()
        
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({error: 'Request is not authorized'})
    }

}

export default authOptional