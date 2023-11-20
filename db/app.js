const express = require("express");
const {getAllTopics} = require("../controller/controller")
const {handle404} = require("../error")

const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics)




app.use(handle404)




module.exports = app;
