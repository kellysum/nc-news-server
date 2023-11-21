const { selectArticleByArticleId } = require("../model/articles.model")
const { selectTopics } = require("../model/topics.model")
const endpoints = require("../endpoints.json")

exports.getAllTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
        res.status(200).send({topics})
        })
        .catch(next)
  
}

exports.getArticleId = (req, res, next)=>{
    const{article_id} = req.params;

    selectArticleByArticleId(article_id).then((articles)=>{
        console.log(articles)
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getAllApi = (req, res)=>{
res.status(200).send({endpoints})
}

