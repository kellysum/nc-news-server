const { selectArticleByArticleId, selectArticles, checkArticleExist } = require("../model/articles.model")
const { selectTopics } = require("../model/topics.model")
const endpoints = require("../endpoints.json")
const { selectComments } = require("../model/comments.model")

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
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getAllApi = (req, res, next)=>{
res.status(200).send({endpoints})
.catch(next)
}

exports.getAllArticles = (req, res, next)=>{
    selectArticles()
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getCommentByArticleId = (req, res, next)=>{
    const {article_id} = req.params
    const commentPromise =  [checkArticleExist(article_id), selectComments(article_id)]

    Promise.all(commentPromise)
    .then((resolvedPromises) =>{
        const comments = resolvedPromises[1]
        res.status(200).send({comments})
    })
    .catch(next)
}
