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
                id:user.id,
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: false
            }
        })

        

        const [createdArticle] = await db('articles').where('id', article).select('*')
        // console.log(createdArticle);

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


//get a articles

export const getArticle = async(req, res) => {
    try {
        const { slug } = req.params
        
        const [article] = await db('articles').where({slug}).select('*')
        if (!article) {
            return res.status(404).json({ error: "article not found" })
          }
        //   console.log(article);

          res.status(200).json({article:{
            ...article,
            tagList: JSON.parse(article.tagList),
            author: JSON.parse(article.author)
        }})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}


//delete article
export const deleteArticle = async(req, res) => {
    try {
        const { slug } = req.params;
        const {id} = req.user
        
        const [article] = await db('articles').where({slug}).select('*')
        if (!article) {
            return res.status(404).json({ error: "article not found" })
          }
          console.log(article);
        // const author = JSON.parse(article.author)
        // const authorId = author.id

        // if(!authorId===id){
        //     return res.status(401).json({ error: 'You are not authorized to delete this article' })
        // }
        
        // console.log(author);
        await db('articles').where({ slug }).del()
        
        res.status(200).json(article)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// get all articles
export const getAllArticles = async(req, res) => {
    try {
        const articles = await db('articles').select('*')

        const articleList = articles.map(article => {
            return {
              ...article,
              tagList: JSON.parse(article.tagList),
              author: JSON.parse(article.author),
            }
          });
        res.status(200).json({articles:articleList})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
    
}