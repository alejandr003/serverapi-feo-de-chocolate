const bd = require ('../../BD/mysqlv2')

const TABLA = 'clientes'

function todos (){
    return bd.todos(TABLA)
}

function uno (id){
    return bd.uno(TABLA, id)
}
function agregar (body){
    return bd.agregar(TABLA, body)
}

function eliminar (body){
    return bd.eliminar(TABLA,body)
}
module.exports={
    todos,uno,agregar,eliminar
}