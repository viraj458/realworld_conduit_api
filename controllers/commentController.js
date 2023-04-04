import db from '../db.js'

//add comment
export const createComment = async(req, res) => {
    
    try {
        const {slug} = req.params
        const {id} = req.user

        const {body} = req.body.comment

        const comment = await db('comments').insert({
            body,
            article_slug: slug,
            user_id: id
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

//delete a comment
export const deleteComment = async(req, res) => {
    try {
        const {id} = req.user
        console.log(id);
        const {commentid} = req.params
        console.log(commentid);

        const [comment] = await db('comments').where({id: commentid}).andWhere({user_id: id})
        if(!comment){
            return res.status(401).json({error: "comment not found"})
        }
        await db('comments').where({id: commentid}).andWhere({user_id: id}).del()
        res.status(200).json(comment)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}