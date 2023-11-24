const app = require("../db/app");
const db = require("../db/connection");

exports.selectArticleByArticleId = (article_id)=>{
  return db.query(`
  SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;
  `,[article_id])
  .then((result)=>{
      if(result.rows.length === 0){
          return Promise.reject({status: 404, msg:"Article not found"})
      }
      return result.rows[0]
  })
}


exports.selectArticles = (topic = null) => {
  
  let query = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
    CAST (COUNT (comments.article_id) AS INT) AS comment_count 
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    `;

  if (topic) {
    query += `WHERE articles.topic = '${topic}' `;
  }

  query += `
    GROUP BY articles.author, title, topic, articles.created_at, articles.votes, article_img_url, articles.article_id
    ORDER BY created_at DESC;
  `;

  return db.query(query)
    .then((result) => {
      return result.rows;
    })
    
};


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

exports.updateVote = (article_id, inc_votes) => {
    if (inc_votes === 0 || typeof inc_votes !== 'number') {
      return Promise.reject({ status: 400, msg: 'Bad request' });
    }
  
    return db.query('SELECT votes FROM articles WHERE article_id = $1', [article_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Article not found' });
        }else{
            return result
        }
      })
      .then((result) => {
        const currentVotes = result.rows[0].votes;
        const updatedVotes = currentVotes + inc_votes;
  
        if (updatedVotes < 0) {
          return Promise.reject({ status: 400, msg: 'Bad request' });
        }
  
        let updateQuery;
        let queryParams;
  
        
        updateQuery = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
        queryParams = [inc_votes, article_id];
       
          
  
        return db.query(updateQuery, queryParams)
          .then((result) => {
           
            return result.rows[0];
          });
      })
  };
  
 
  
  