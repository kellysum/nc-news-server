const db = require("../db/connection");

const comments = require("../db/data/test-data/comments");


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

exports.insertComment=(comments, article_id) =>{
    const {username, comment} = comments
   
    const psqlQuery = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`

    return db.query(psqlQuery, [username, comment, article_id])
    .then((data)=>{
     
    return data.rows[0]
       
    })
}

exports.deleteByCommentId = (comment_id)=>{
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result)=>{
        return;
    })
}