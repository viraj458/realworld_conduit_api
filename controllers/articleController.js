import db from '../db.js'
import uniqueSlug from 'unique-slug'

//create article
export const createArticle = async(req, res) => {
    try {

        const {id} = req.user
        const user = await db('users').where({id}).first()

        const {body,description,title,tagList} = req.body.article
    
        const slug = uniqueSlug(title);

        const [article] = await db('articles').insert({
            slug,
            body,
            description,
            title,
            author: user.id
        })

        const createdArticle = await db('articles').where('id', article).select('*').first()
    //    console.log(createdArticle);


        Promise.all(tagList.map(async tag => {
            await db('tags').insert({ article_id: createdArticle.id, tag: tag });
        }))
        
        
        const selectTags = await db('tags').where({article_id: createdArticle.id}).select('tag')
        const tagArr = selectTags.map(elem => elem.tag)
        // console.log(tagArr)

        res.status(200).json({article:{
            slug,
            body,
            description,
            title,
            tagList: tagArr,
            createdAt: createdArticle.createdAt,
            updatedAt: createdArticle.updatedAt,
            favorited: createdArticle.favouriteCount? true: false,
            favoritesCount: createdArticle.favouriteCount,
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
        //   console.log(article);

        const selectTags = await db('tags').where({article_id: article.id}).select('tag')
        const tagArr = selectTags.map(elem => elem.tag)

          res.status(200).json({article:{
            slug: article.slug,
            body: article.body,
            description: article.description,
            title: article.title,
            tagList: tagArr,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            favorited: article.favouriteCount ? true : false,
            favoritesCount: article.favouriteCount,
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
        
        const article = await db('articles').where({slug}).andWhere({author: id}).first()

        if (!article) {
            return res.status(404).json({ error: "article not found" })
          }
   
        const selectTags = await db('tags').where({article_id: article.id}).select('tag')
        const tagArr = selectTags.map(elem => elem.tag)

        await db('tags').where({article_id: article.id}).del()

        await db('articles').where({slug}).andWhere({author: id}).del()
        
        res.status(200).json({article:{
            slug: article.slug,
            body: article.body,
            description: article.description,
            title: article.title,
            tagList: tagArr,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            favorited: article.favouriteCount ? true : false,
            favoritesCount: article.favouriteCount,
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

//List articles by tag, author, favorited, limit, offset and get all
export const listArticles = async(req, res) => {
    try {

        const { tag, author, favorited, limit = 20, offset = 0 } = req.query;

        if(tag){

            const articles = await db('articles')
            .join('users', 'articles.author', 'users.id')
            .join('tags', 'articles.id', 'tags.article_id')
            .select('articles.*', 'users.username', 'users.bio', 'users.image', 'tags.tag')
            .where({tag: tag})
            .limit(limit)
            .offset(offset)
        

            // console.log(articles);

            const articleArr = await Promise.all(articles.map(async elem=>{

                const selectTags = await db('tags').where({article_id: elem.id}).select('tag')
                const tagArr = selectTags.map(e => e.tag)

                

                return {
                    slug: elem.slug,
                    title: elem.title,
                    description: elem.description,
                    body: elem.body,
                    tagList: tagArr,
                    createdAt: elem.createdAt,
                    updatedAt: elem.updatedAt,
                    favorited: elem.favoritesCount ? true : false,
                    favoritesCount: elem.favouriteCount,
                    author:{
                        username: elem.username,
                        bio: elem.bio,
                        image: elem.image,
                    }
                }

            }))
            res.status(200).json({
                articles: articleArr,
                articlesCount: articles.length
            })
        }

        if(author){
            const articles = await db('articles')
            .join('users', 'articles.author', 'users.id')
            .join('tags', 'articles.id', 'tags.article_id')
            .select('articles.*', 'users.username', 'users.bio', 'users.image', 'tags.tag')
            .where({username: author})
            .limit(limit)
            .offset(offset)

            console.log(articles);
            const articleArr = await Promise.all(articles.map(async elem=>{

                const selectTags = await db('tags').where({article_id: elem.id}).select('tag')
                const tagArr = selectTags.map(e => e.tag)

                return {
                    slug: elem.slug,
                    title: elem.title,
                    description: elem.description,
                    body: elem.body,
                    tagList: tagArr,
                    createdAt: elem.createdAt,
                    updatedAt: elem.updatedAt,
                    favorited: elem.favoritesCount ? true : false,
                    favoritesCount: elem.favouriteCount,
                    author:{
                        username: elem.username,
                        bio: elem.bio,
                        image: elem.image,
                    }
                }

            }))
            res.status(200).json({
                articles: articleArr,
                articlesCount: articles.length
            })
        }
        
        if(favorited){
            
            const x = await db('users').where({username: favorited}).select('id').first()

            const articles = await db('favorite')
            .join('users', 'users.id', 'favorite.user_id')
            .join('articles', 'articles.id', 'favorite.article_id')
            .select('articles.*', 'users.username', 'users.bio', 'users.image')
            .where({user_id: x.id})
            .limit(limit)
            .offset(offset)


            const articleArr = await Promise.all(articles.map(async elem=>{

                const selectTags = await db('tags').where({article_id: elem.id}).select('tag')
                const tagArr = selectTags.map(e => e.tag)

                return {
                    slug: elem.slug,
                    title: elem.title,
                    description: elem.description,
                    body: elem.body,
                    tagList: tagArr,
                    createdAt: elem.createdAt,
                    updatedAt: elem.updatedAt,
                    favorited: elem.favoritesCount ? true : false,
                    favoritesCount: elem.favouriteCount,
                    author:{
                        username: elem.username,
                        bio: elem.bio,
                        image: elem.image,
                    }
                }

            }))
            return res.status(200).json({
                articles: articleArr,
                articlesCount: articles.length
            })
        }

        const articles = await db('articles')
            .join('users', 'articles.author', 'users.id')
            .join('tags', 'articles.id', 'tags.article_id')
            .select('articles.*', 'users.username', 'users.bio', 'users.image', 'tags.tag')
            .limit(limit)
            .offset(offset)

            console.log(articles);
            const articleArr = await Promise.all(articles.map(async elem=>{

                const selectTags = await db('tags').where({article_id: elem.id}).select('tag')
                const tagArr = selectTags.map(e => e.tag)

                return {
                    slug: elem.slug,
                    title: elem.title,
                    description: elem.description,
                    body: elem.body,
                    tagList: tagArr,
                    createdAt: elem.createdAt,
                    updatedAt: elem.updatedAt,
                    favorited: elem.favoritesCount ? true : false,
                    favoritesCount: elem.favouriteCount,
                    author:{
                        username: elem.username,
                        bio: elem.bio,
                        image: elem.image,
                    }
                }

            }))
            res.status(200).json({
                articles: articleArr,
                articlesCount: articles.length
            })
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
    
}

//update a article
export const updateArticle = async(req, res) => {
    try {
        const {tagList} = req.params
        const {slug} = req.params
        const {id} = req.user
        // console.log(id);

        const findArticle = await db('articles').where({slug}).andWhere({author: id}).first()
        if(!findArticle){
            return res.status(401).json({error: 'article not found'})
        }
        await db('articles').where({slug}).andWhere({author: id}).update({body: req.body.article.body})
        

        const selectTags = await db('tags').where({article_id: findArticle.id}).select('tag')
        const tagArr = selectTags.map(elem => elem.tag)

        const [article] = await db('articles')
        .where({slug})
        .join('users', 'articles.author', 'users.id')
        .select('articles.*', 'users.username', 'users.bio', 'users.image')

        if (!article) {
            return res.status(404).json({ error: "article not found" })
          }
        //   console.log(article);

          res.status(200).json({article:{
            slug: article.slug,
            body: article.body,
            description: article.description,
            title: article.title,
            tagList: tagArr,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            favorited: article.favouriteCount? true: false,
            favoritesCount: article.favouriteCount,
            author:{
              username: article.username,
              bio: article.bio,
              image: article.image,
              following: false
            }
        }})
    } catch (err) {
        res.status(400).json({error: err.message})
    }



}


//article feed controller
export const feedArticle = async(req, res) => {
 try {
    const articles = await db('articles')
    .limit(20).orderBy('updatedAt')
    .join('users', 'articles.author', 'users.id')
    .select('articles.*', 'users.username', 'users.bio', 'users.image')

    // console.log(articles);
    const articleFeed = (articles.map( article => {
            return {
              slug: article.slug,
              body: article.body,
              description: article.description,
              title: article.title,
              tagList: JSON.parse(article.tagList),
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
              favorited: article.favouriteCount? true: false,
              favoritesCount: article.favouriteCount,
              author:{
                username: article.username,
                bio: article.bio,
                image: article.image,
                following: false
            }
            }
          }));


    res.status(200).json({articles: articleFeed, articlesCount: articleFeed.length})
 } catch (err) {
    res.status(400).json({error: err.message})
 }   
}

