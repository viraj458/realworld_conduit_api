import db from '../db.js'

//get all tags
export const getAllTags = async(req, res) => {
    try {
        const tags = await db('tags').distinct('tag')
        const tagArr = tags.map(elem=> elem.tag)
        res.status(200).json({tags:tagArr})

    } catch (err) {
        res.status(400).json({error:err.message})
    }
    
}   