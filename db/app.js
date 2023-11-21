const express = require("express");
const {getAllTopics, getAllApi} = require("../controller/controller")
const {handle404} = require("../error")

const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics)
app.get('/api', getAllApi)



app.use(handle404)




module.exports = app;
