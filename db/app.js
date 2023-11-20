const express = require("express");
const {getAllTopics} = require("../controller/controller")
const {handlePsqErrors, handleCustomErrors,handle404} = require("../error")

const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics)




app.use(handle404)

app.use(handlePsqErrors)
app.use(handleCustomErrors)


module.exports = app;
