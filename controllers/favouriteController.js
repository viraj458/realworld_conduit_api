import db from '../db.js'


export const favouriteArticle = async(req, res) => {
    const {id} = req.user
    const {slug} = req.params

    //add users favourite articles to favouriteArticles in users table
    const article = await db('articles').where({slug}).select('id').first()
    const articleId = article.id
    // console.log(articleId);

    const favourite = await db('users').where({id}).select('favouriteArticles').first()
    // console.log(favourite.favouriteArticles);

    const favouriteArticles = favourite.favouriteArticles ? favourite.favouriteArticles.split(',') : [];
    // console.log(favouriteArticles);

    const favouriteArticlesInt = favouriteArticles.map(elem=>parseInt(elem))
    // console.log(favouriteArticlesInt);

    if(favouriteArticlesInt.indexOf(articleId)===-1){
        favouriteArticles.push(articleId)
    }

    await db('users').where({id}).update({favouriteArticles: favouriteArticles.join(',')})
    

}

export const unFavouriteArticle = async(req, res) => {
    
}