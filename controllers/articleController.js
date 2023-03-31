import db from '../db.js'

export const createArticle = async(req, res) => {
    try {

        const {id} = req.user
        const user = await db('users').where({id}).first()


        const {body,description,title,tagList} = req.body.article
        const tag_list = JSON.stringify(tagList)
        
        // console.log(tagList);

        const [article] = await db('articles').insert({
            body,
            description,
            title,
            tagList: tag_list,
            author: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: false
            }
        })
        console.log(article);

        res.status(200).json(article)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
