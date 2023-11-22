const db = require("../db/connection");

exports.selectComments = (article_id)=>{
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`, [article_id])
    .then((result)=>{
        return result.rows
    })
}

exports.checkCommentsExists = (comment_id) =>{
    return db.query(`SELECT * FROM comments WHERE comment_id =  $1;`, [comment_id])
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({status : 404, msg:"not found"})
        }
    })
}