exports.handle404 = (req, res) =>{
    res.status(404).send({msg: "path not found"})
  }

  exports.handleCustomErrors = (err, req, res, next) =>{
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

exports.handlePsqErrors = (err, req, res, next) =>{
    if(err.code === "22P02" || err.code === "23502") {
      res.status(400).send({msg: "Bad request"});
  } else if(err.code==="23503"){
    res.status(404).send({msg: 'username not found'})
 } else {
      next(err)
  }
}

exports.handleServerErrors = (err, req, res, next) =>{
    console.log(err)
    res.status(500).send({msg : "internal server error"})
} 

