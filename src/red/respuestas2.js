
exports.success = function (req, res, status = 200, msg = 'hola') {
    res.status(status).send({
        status: status,
        error: false,
        mensaje: msg,
        severity: 'success'
    })

}

exports.error = function (req, res, status, msg) {
    const codestatus = status || 500
    const mesaje = msg || 'Error interno'

    res.status(codestatus).send({
        status: codestatus,
        error: true,
        mensaje: mesaje,
        severity: 'error'
    })
}
