const express = require("express");

const {getAllTopics, getArticleId, getAllArticles, getAllApi, getCommentByArticleId} = require("../controller/controller")


const {handle404, handleCustomErrors, handlePsqErrors} = require("../error")


const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics)
app.get("/api/articles/:article_id", getArticleId)
app.get('/api', getAllApi)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id/comments', getCommentByArticleId)

app.use(handle404)
app.use(handleCustomErrors)
app.use(handlePsqErrors)


module.exports = app;
