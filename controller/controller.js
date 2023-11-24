const { selectArticleByArticleId, selectArticles, checkArticleExist, updateVote} = require("../model/articles.model")
const { selectTopics, checkTopicExist } = require("../model/topics.model")
const endpoints = require("../endpoints.json")
const { insertComment, checkCommentsExists, deleteByCommentId } = require("../model/comments.model")
const {checkUserExist} = require("../model/username.model")



const { selectComments } = require("../model/comments.model")
const { selectUsers } = require("../model/users.model")


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

exports.getAllArticles = (req, res, next) => {
    const { topic } = req.query;
  
    if (!topic) {
      selectArticles()
        .then((articles) => {
          res.status(200).send({ articles });
        })
    } else {
      Promise.all([
        checkTopicExist(topic),
        selectArticles(topic)
      ])
        .then(([topicExists, articles]) => {
          res.status(200).send({ articles });
        })
        .catch(next);
    }
  };
  
  

exports.postComment = (req, res, next)=>{
    const {article_id} = req.params 
   const newComment = req.body
   const username = req.body.username
   
   const commentPromise = [insertComment(newComment, article_id)]
   
   if(username){
       commentPromise.push(checkUserExist(username))
    }
    
   Promise.all(commentPromise)
 .then((resolvedPromises)=>{

    const postedComment = resolvedPromises[0]
    res.status(201).send({postedComment})
    })
    .catch(next)
}
exports.patchArticleVote = (req, res, next)=>{
    const {article_id} = req.params
    const {inc_votes} = req.body


    updateVote(article_id, inc_votes)
    .then((updatedArticle)=>{
        res.status(200).send({ article: updatedArticle })
        })
        .catch(next)
    }

    exports.deleteComment = (req, res, next)=>{
        const {comment_id} = req.params

      const deleteCommentPromise = [ deleteByCommentId(comment_id), checkCommentsExists(comment_id)]
      
       
       
       Promise.all(deleteCommentPromise)
      .then(()=>{
            
        res.status(204).send()
        })
        .catch(next)
    }
    exports.getAllUsers = (req, res, next) => {
        selectUsers()
            .then((users) => {
            res.status(200).send({users})
            })
            .catch(next)
      
    }