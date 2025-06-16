const bd = require ('../../BD/mysqlv2')

const TABLA = 'usuario'

function todos (){
    return bd.todos(TABLA)
}

function uno (id){
    return bd.uno(TABLA, id)
}

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Puedes usar 10 como nivel de complejidad


async function agregar (body){
    const password = body.pw || body.password;
    if (!body.nombre || !body.email || !password) {
        return { status: false, mensaje: 'Faltan datos obligatorios' };
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const nuevoUsuario = {
        id: body.id || 0, 
        nombre: body.nombre,
        email: body.email,
        pw: hashedPassword,
        status: body.status || 1
    };
    return bd.agregar(TABLA, nuevoUsuario)
}

function eliminar (body){
    return bd.eliminar(TABLA,body)
}
function login(body) {

    let loginData = {};
    if (body.user && body.password) {
        loginData = { user: body.user, password: body.password };
    } else if (body.email && body.pw) {
        loginData = { user: body.email, password: body.pw };
    } else {
        return Promise.resolve({ status: false, mensaje: 'Faltan credenciales' });
    }
    return bd.login(TABLA, loginData);
}
module.exports={
    todos,uno,agregar,eliminar,login
}