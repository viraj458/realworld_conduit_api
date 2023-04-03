import db from '../db.js'

//get all tags
export const getAllTags = async(req, res) => {
    const tags = await db('articles').distinct('tagList').pluck('tagList')
    const str = tags.toString(tags)
    // console.log(str);

    const tagsString = str.replace(/[\[\]"]/g, '');
    // console.log(tagsString);

    const seperatedTags = tagsString.split(',');
    // console.log(seperatedTags);

    const uniqueArr = [...new Set(seperatedTags)]

    res.status(200).json({tags:uniqueArr})
    
}   