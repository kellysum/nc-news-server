const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
         .then((result)=>{
            return result.rows
        
        })
}



    exports.checkTopicExist = (topic) => {
        return db.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
          .then(({ rows }) => {
            if (!rows.length) {
              return Promise.reject({ status: 404, msg: "Topic not found" });
            } else {
              return rows[0];
            }
          })
        }
    