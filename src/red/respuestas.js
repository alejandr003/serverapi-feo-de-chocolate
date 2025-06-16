
exports.success=function(req,res,status=200,msg=''){
res.status(status).send({
    error:false,
    variant:'success',
    status:status,
    body:msg
})
}

exports.error=function(req,res,status=500,msg='error interno'){

    res.status(status).send({
        error:true,
        status:status,
        variant:'error',
        body:msg
    })
}