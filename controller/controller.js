
const { selectTopics } = require("../model/model")

exports.getAllTopics = (req, res) => {
    selectTopics()
        .then((topics) => {
        res.status(200).send({topics})
        })
  
};

