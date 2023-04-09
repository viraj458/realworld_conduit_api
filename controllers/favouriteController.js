import db from '../db.js'

//favourite controller
export const favouriteArticle = async(req, res) => {
    try {
        const {id} = req.user
        const {slug} = req.params


        const article = await db('articles').where({slug}).select('id').first()

        if(!article){
            return res.status(404).json('article not found')
        }

        const favorite = await db('favorite').insert({user_id: id, article_id: article.id})
        
        await db('articles').where({slug}).increment('favouriteCount', 1)
        


        const articleInfo = await db('favorite')
        .join('users', 'users.id', 'favorite.user_id')
        .join('articles', 'articles.id', 'favorite.article_id')
        .select('articles.*', 'users.username', 'users.bio', 'users.image').first()


        res.status(200).json({article:{
            slug: articleInfo.slug,
            body: articleInfo.body,
            description: articleInfo.description,
            title: articleInfo.title,
            tagList: JSON.parse(articleInfo.tagList),
            createdAt: articleInfo.createdAt,
            updatedAt: articleInfo.updatedAt,
            favorited: favorite? true: false,
            favoritesCount: articleInfo.favouriteCount,
            author:{
              username: articleInfo.username,
              bio: articleInfo.bio,
              image: articleInfo.image,
              following: false
            }
        }})
    
    } catch (err) {
        res.status(400).json({error: err.message})
    }
    
}


//unfavourite controller
export const unFavouriteArticle = async(req, res) => {

    try {
        const {id} = req.user
        const {slug} = req.params

        const article = await db('articles').where({slug}).select('id').first()

        

        if(!article){
            return res.status(404).json('no such article found')
        }

        const selectFavorite = await db('favorite').where({user_id: id, article_id: article.id}).first()
        if(!selectFavorite){
            return res.status(404).json('article not found in favorites')
        }

        const unfavorite = await db('favorite').where({user_id: id, article_id: article.id}).del()
        await db('articles').where({slug}).decrement('favouriteCount', 1)
        
        const articleInfo = await db('articles')
        .join('users', 'users.id', 'articles.author')
        .select('articles.*', 'users.username', 'users.bio', 'users.image').first()

        res.status(200).json({article:{
            slug: articleInfo.slug,
            body: articleInfo.body,
            description: articleInfo.description,
            title: articleInfo.title,
            tagList: JSON.parse(articleInfo.tagList),
            createdAt: articleInfo.createdAt,
            updatedAt: articleInfo.updatedAt,
            favorited: unfavorite ? false : true,
            favoritesCount: articleInfo.favouriteCount,
            author:{
              username: articleInfo.username,
              bio: articleInfo.bio,
              image: articleInfo.image,
              following: false
            }
        }})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
    
}