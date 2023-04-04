import db from '../db.js'

export const createComment = async(req, res) => {
    
    try {
        const {slug} = req.params

        const {body} = req.body.comment

        const comment = await db('comments').insert({
            body,
            slug
        })

        

        console.log(comment);
        res.status(200).json({comment:comment})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

