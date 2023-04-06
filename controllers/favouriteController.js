import db from '../db.js'


export const favouriteArticle = async(req, res) => {
    try {
        const {id} = req.user
        const {slug} = req.params

        //add users favourite articles to favouriteArticles in users table. 

        const article = await db('articles').where({slug}).select('id').first()
        

        const favourite = await db('users').where({id}).select('favouriteArticles').first()
        // console.log(favourite.favouriteArticles);

        const favouriteArticles = favourite.favouriteArticles ? favourite.favouriteArticles.split(',') : [];
        // console.log(favouriteArticles);

        const favouriteArticlesInt = favouriteArticles.map(elem=>parseInt(elem))
        // console.log(favouriteArticlesInt);

        if(favouriteArticlesInt.indexOf(article.id)===-1){
            favouriteArticles.push(article.id)

            //update the favourite count on a specific article
            await db('articles').where({slug}).increment('favouriteCount', 1)
            console.log(article);
        }

        await db('users').where({id}).update({favouriteArticles: favouriteArticles.join(',')})
        
      
        
        const [articleInfo] = await db('articles')
        .where({slug})
        .join('users', 'articles.author', 'users.id')
        .select('articles.*', 'users.username', 'users.bio', 'users.image')

        

        res.status(200).json({article:{
            slug: articleInfo.slug,
            body: articleInfo.body,
            description: articleInfo.description,
            title: articleInfo.title,
            tagList: JSON.parse(articleInfo.tagList),
            createdAt: articleInfo.createdAt,
            updatedAt: articleInfo.updatedAt,
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

export const unFavouriteArticle = async(req, res) => {
    
}