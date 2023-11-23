const express = require("express");


const {getAllTopics, getArticleId, getAllArticles, getAllApi, getCommentByArticleId, postComment, patchArticleVote} = require("../controller/controller")







const {handle404, handleCustomErrors, handlePsqErrors} = require("../error")


const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics)
app.get("/api/articles/:article_id", getArticleId)
app.get('/api', getAllApi)
app.get('/api/articles', getAllArticles)

app.post('/api/articles/:article_id/comments', postComment)


app.get('/api/articles/:article_id/comments', getCommentByArticleId)

app.patch('/api/articles/:article_id', patchArticleVote)



app.use(handle404)
app.use(handleCustomErrors)
app.use(handlePsqErrors)


module.exports = app;
