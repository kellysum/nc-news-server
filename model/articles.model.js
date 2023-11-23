const app = require("../db/app");
const db = require("../db/connection");

exports.selectArticleByArticleId = (article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[article_id])
    .then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg:"Article not found"})
        }
        return result.rows[0]
    })
}

exports.selectArticles = ()=>{
    return db.query(`
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
    CAST (COUNT (comments.article_id) AS INT) AS comment_count 
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.author, title, topic, articles.created_at, articles.votes, article_img_url, articles.article_id
    ORDER BY created_at DESC;`
    )
    .then((result)=>{
        return result.rows
    })
}


exports.checkArticleExist = (article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({status : 404, msg:"not found"})
        } else{
            return rows[0]
        }
    })
}

exports.updateVote = (article_id, inc_votes)=>{
   if(inc_votes === 0 || typeof inc_votes !== 'number'){
    return Promise.reject({ status: 400, msg: 'Bad request' })
   }
    let updateQuery;
    let queryParams;

    if(inc_votes > 0){
        updateQuery = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`
        queryParams = [inc_votes, article_id]
    } else{
        updateQuery = `UPDATE articles SET votes = votes - $1 WHERE article_id = $2 RETURNING *`
        queryParams = [-inc_votes, article_id]
    }

    return db.query(updateQuery, queryParams)
    .then((result)=>{
        if(result.rows.length === 0 ){
            return Promise.reject({status : 404, msg: 'Article not found'})
        }
        console.log(result.rows[0])
        return result.rows[0]
    })
}
