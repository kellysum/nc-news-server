const express = require("express");
const {getAllTopics, getArticleId} = require("../controller/controller")
const {handle404, handleCustomErrors, handlePsqErrors} = require("../error")

const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get("/api/articles/:article_id", getArticleId)


app.use(handle404)
app.use(handleCustomErrors)
app.use(handlePsqErrors)


module.exports = app;
