exports.handle404 = (req, res) =>{
    res.status(404).send({msg: "path not found"})
  }