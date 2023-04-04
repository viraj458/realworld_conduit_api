import db from '../db.js'
import uniqueSlug from 'unique-slug'

//create article
export const createArticle = async(req, res) => {
    try {

        const {id} = req.user
        const user = await db('users').where({id}).first()


        const {body,description,title,tagList} = req.body.article
        const tag_list = JSON.stringify(tagList)

        const slug = uniqueSlug(title);
        
        // console.log(tagList);

        const [article] = await db('articles').insert({
            slug,
            body,
            description,
            title,
            tagList: tag_list,
            author: user.id
        })

        

        const [createdArticle] = await db('articles').where('id', article).select('*')
        console.log(createdArticle);

        res.status(200).json({article:{
            slug,
            body,
            description,
            title,
            tagList: JSON.parse(tag_list),
            createdAt: createdArticle.createdAt,
            updatedAt: createdArticle.updatedAt,
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

        const [article] = await db('articles')
        .where({slug})
        .join('users', 'articles.author', 'users.id')
        .select('articles.*', 'users.username', 'users.bio', 'users.image')

        if (!article) {
            return res.status(404).json({ error: "article not found" })
          }
          console.log(article);

          res.status(200).json({article:{
            slug: article.slug,
            body: article.body,
            description: article.description,
            title: article.title,
            tagList: JSON.parse(article.tagList),
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            author:{
              username: article.username,
              bio: article.bio,
              image: article.image,
              following: false
            }
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
        
        const [article] = await db('articles').where({slug}).andWhere({author: id})
        
        if (!article) {
            return res.status(404).json({ error: "article not found" })
          }
        //   console.log(article);
   
        await db('articles').where({slug}).andWhere({author: id}).del()
        
        res.status(200).json(article)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// get all articles
export const getAllArticles = async(req, res) => {
    try {

        const articles = await db('articles')
        .join('users', 'articles.author', 'users.id')
        .select('articles.*', 'users.username', 'users.bio', 'users.image')
        

        const articleList = (articles.map( article => {
            return {
              slug: article.slug,
              body: article.body,
              description: article.description,
              title: article.title,
              tagList: JSON.parse(article.tagList),
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
              author:{
                username: article.username,
                bio: article.bio,
                image: article.image,
                following: false
            }
            }
          }));

        res.status(200).json({articles:articleList, articlesCount:articleList.length})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
    
}