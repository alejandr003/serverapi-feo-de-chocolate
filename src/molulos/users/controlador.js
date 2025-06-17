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
async function login(body) {
    console.log('Login recibido:', body);
    
    // Verificar si tenemos credenciales
    let loginData = {};
    if (body.user && body.password) {
        loginData = { user: body.user, password: body.password };
        console.log('Usando user/password');
    } else if (body.email && body.pw) {
        loginData = { user: body.email, password: body.pw };
        console.log('Usando email/pw');
    } else if (body.email && body.password) {
        loginData = { user: body.email, password: body.password };
        console.log('Usando email/password');
    } else if (body.user && body.pw) {
        loginData = { user: body.user, password: body.pw };
        console.log('Usando user/pw');
    } else {
        console.log('Faltan credenciales en body:', body);
        return { status: false, mensaje: 'Faltan credenciales', debug: body };
    }
    
    // Asegurarnos de que los valores no sean undefined
    if (!loginData.user || !loginData.password) {
        console.log('Usuario o contraseña indefinidos:', loginData);
        return { status: false, mensaje: 'Usuario o contraseña no pueden estar vacíos' };
    }
    
    console.log('Intentando login con:', { user: loginData.user, passwordLength: loginData.password.length });
    return await bd.login(TABLA, loginData);
}
module.exports={
    todos,uno,agregar,eliminar,login
}