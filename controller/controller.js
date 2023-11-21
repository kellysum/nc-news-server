const { selectTopics } = require("../model/model")
const endpoints = require("../endpoints.json")

exports.getAllTopics = (req, res) => {
    selectTopics()
        .then((topics) => {
        res.status(200).send({topics})
        })
  
}
exports.getAllApi = (req, res)=>{
res.status(200).send({endpoints})
}




