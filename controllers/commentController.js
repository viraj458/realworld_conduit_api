import db from '../db.js'

//add comment
export const createComment = async(req, res) => {
    
    try {
        const {slug} = req.params

        const {body} = req.body.comment

        const comment = await db('comments').insert({
            body,
            article_slug: slug
        })

        

        console.log(comment);
        res.status(200).json({comment:comment})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

//get all comments
export const getAllComments = async(req, res) => {
    try {
        const {slug} = req.params

        const comments = await db('comments')
        .join('articles', 'comments.article_slug', 'articles.slug')
        .join('users', 'articles.author', 'users.id')
        .select('users.username', 'users.bio', 'users.image','comments.id', 'comments.body', 'comments.createdAt', 'comments.updatedAt')
        .where({slug})


        const commentsList = (comments.map(comment => {
            return{
                    id: comment.id,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                    body: comment.body, 
                    author:{
                        username: comment.username,
                        bio: comment.bio,
                        image: comment.image
                    
                }
            }
        }))

        res.status(200).json({comments: commentsList})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
    
}