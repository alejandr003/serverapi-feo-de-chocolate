exports.success= function(req,res,status=200,msg=''){
res.status(status).send({
    error:false,
    status:status,
    body:msg,
    severity:'success'
})
}

exports.error = function (req,res,status,msg){
    const codestatus = status || 500
    const mesg = msg ||'Error interno'

    res.status(codestatus).send({
        error:true,
        status:codestatus,
        body:mesg,
        severity:'error'
    })
}