import db from '../db.js'
import slugify from 'slugify'

//create article
export const createArticle = async(req, res) => {
    try {

        const {id} = req.user
        const user = await db('users').where({id}).first()


        const {body,description,title,tagList} = req.body.article
        const tag_list = JSON.stringify(tagList)

        const slug = slugify(title);
        
        // console.log(tagList);

        const [article] = await db('articles').insert({
            slug,
            body,
            description,
            title,
            tagList: tag_list,
            author:{
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: false
            }
        })

        

        const [createdArticle] = await db('articles').where('id', article).select('*')
        console.log(createdArticle);

        res.status(200).json({article:{
            slug,
            body,
            description,
            title,
            tagList: JSON.parse(tag_list),
            author:{
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: false
            }
        }})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}


//get all articles

export const getAllArticles = async(req, res) => {
    
}

//delete article
export const deleteArticle = async(req, res) => {
    
}