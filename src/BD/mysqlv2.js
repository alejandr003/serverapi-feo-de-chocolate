const mysql = require('mysql2/promise');
const config = require('../config');
const bcrypt = require('bcrypt');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

let conexion;

// Función para conectar a MySQL con `mysql2`
async function conMysql() {
    try {
        // Verificamos la configuración antes de conectar
        console.log('Configuración BD:', {
            host: dbconfig.host,
            user: dbconfig.user,
            database: dbconfig.database || 'NO ESPECIFICADA'
        });
        
        conexion = await mysql.createConnection(dbconfig);
        console.log('BD conectada correctamente');
        
        // Verificar que la base de datos existe
        const [result] = await conexion.query('SELECT DATABASE() as db');
        console.log('Base de datos actual:', result[0].db);

        // Manejo de errores de conexión
        conexion.on('error', async (err) => {
            console.error('[BD ERROR]', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Conexión perdida. Reconectando...');
                await conMysql();
            } else {
                throw err;
            }
        });
    } catch (error) {
        console.error('[BD ERROR]', error);
        console.error('Revisa las variables de entorno en el archivo .env');
        setTimeout(conMysql, 2000); // Reintento de conexión
    }
}

// Llamar a la conexión al inicio
conMysql();

// Función para obtener todos los registros de una tabla
async function todos(tabla) {
    try {
        console.log(`Consultando todos los registros de la tabla ${tabla}`);
        
        // Primero, verificamos si la tabla existe
        const [tables] = await conexion.query('SHOW TABLES LIKE ?', [tabla]);
        if (tables.length === 0) {
            console.error(`La tabla ${tabla} no existe`);
            return [];
        }
        
        // Usamos parámetros de consulta más seguros
        const [result] = await conexion.query(`SELECT * FROM ??`, [tabla]);
        return result;
    } catch (error) {
        console.error(`Error al consultar todos los registros de tabla ${tabla}:`, error);
        throw error;
    }
}

// Función para obtener un registro por ID
async function uno(tabla, id) {
    try {
        console.log(`Consultando en tabla ${tabla} con ID: ${id}`);
        
        // Primero, verificamos si la tabla existe
        const [tables] = await conexion.query('SHOW TABLES LIKE ?', [tabla]);
        if (tables.length === 0) {
            console.error(`La tabla ${tabla} no existe`);
            return null;
        }
        
        // Verificamos la estructura de la tabla
        const [columns] = await conexion.query('DESCRIBE ??', [tabla]);
        console.log(`Columnas de la tabla ${tabla}:`, columns.map(col => col.Field));
        
        // Verificar si existe la columna id
        const idColumn = columns.find(col => col.Field.toLowerCase() === 'id');
        if (!idColumn) {
            console.error(`La tabla ${tabla} no tiene columna id`);
            throw new Error(`La tabla ${tabla} no tiene columna id`);
        }
        
        // Ahora hacemos la consulta
        const [result] = await conexion.query(`SELECT * FROM ?? WHERE id = ?`, [tabla, id]);
        return result[0]; // Retornar solo el primer elemento
    } catch (error) {
        console.error(`Error al consultar uno en tabla ${tabla}:`, error);
        throw error;
    }
}

// Función para insertar un registro
async function insertar(tabla, data) {
    try {
        // Si data tiene un id con valor 0, lo eliminamos para que MySQL asigne un id automáticamente
        if (data.id === 0) {
            const { id, ...dataWithoutId } = data;
            console.log(`Insertando en ${tabla} sin ID:`, dataWithoutId);
            const [result] = await conexion.query(`INSERT INTO ${tabla} SET ?`, [dataWithoutId]);
            return result;
        } else {
            console.log(`Insertando en ${tabla} con datos completos:`, data);
            const [result] = await conexion.query(`INSERT INTO ${tabla} SET ?`, [data]);
            return result;
        }
    } catch (error) {
        console.error(`Error al insertar en tabla ${tabla}:`, error);
        throw error;
    }
}

// Función para actualizar un registro
async function actualizar(tabla, data) {
    try {
        const { id, ...datosActualizados } = data;
        const [result] = await conexion.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [datosActualizados, id]);
        return result;
    } catch (error) {
        console.error(`Error al actualizar en tabla ${tabla}:`, error);
        throw error;
    }
}

async function agregar(tabla, data) {
    const id = data.id !== undefined ? parseInt(data.id) : 0;
    console.log(`Agregando a tabla ${tabla}, datos:`, data, `id: ${id}`);

    try {
        // Validación específica para la tabla usuario
        if (tabla === 'usuario' && id === 0) {
            console.log('Validando email para usuario:', data.email);
            const [rows] = await conexion.query(`SELECT * FROM ${tabla} WHERE email = ?`, [data.email]);
            if (rows.length > 0) {
                console.log('Correo ya registrado');
                return { status: false, mensaje: 'El correo ya está registrado' };
            }
        }

        // Insertar o actualizar según corresponda
        if (!id || id === 0) {
            const result = await insertar(tabla, data);
            return { status: true, mensaje: 'Datos insertados correctamente', resultado: result };
        } else {
            const result = await actualizar(tabla, data);
            return { status: true, mensaje: 'Datos actualizados correctamente', resultado: result };
        }
    } catch (error) {
        console.error(`Error en agregar (${tabla}):`, error);
        return { status: false, mensaje: `Error al procesar el registro: ${error.message}` };
    }
}


async function eliminar(tabla, body) {
    try {
        const id = body.id;
        if (!id) {
            return { status: false, mensaje: 'Debe proporcionar un ID para eliminar' };
        }
        const [result] = await conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
        if (result.affectedRows > 0) {
            return { status: true, mensaje: 'Registro eliminado correctamente' };
        } else {
            return { status: false, mensaje: 'No se encontró el registro para eliminar' };
        }
    } catch (error) {
        console.error(`Error al eliminar de ${tabla}:`, error);
        return { status: false, mensaje: `Error al eliminar: ${error.message}` };
    }
}

async function login(tabla, data) {
    const { user, password } = data;

    try {
        console.log(`Verificando en tabla ${tabla} usuario: ${user}`);
        
        // Primero, verificamos si la tabla existe
        const [tables] = await conexion.query('SHOW TABLES LIKE ?', [tabla]);
        if (tables.length === 0) {
            console.error(`La tabla ${tabla} no existe`);
            return { status: false, mensaje: `Error: La tabla ${tabla} no existe` };
        }
        
        // Verificamos la estructura de la tabla
        const [columns] = await conexion.query('DESCRIBE ??', [tabla]);
        console.log(`Columnas de la tabla ${tabla}:`, columns.map(col => col.Field));
        
        // Verificamos si existe la columna email
        const emailColumn = columns.find(col => col.Field.toLowerCase() === 'email');
        if (!emailColumn) {
            console.error(`La tabla ${tabla} no tiene columna email`);
            return { status: false, mensaje: 'Error: La tabla no tiene la estructura correcta' };
        }
        
        // Verificamos si existe la columna pw
        const pwColumn = columns.find(col => col.Field.toLowerCase() === 'pw');
        if (!pwColumn) {
            console.error(`La tabla ${tabla} no tiene columna pw`);
            return { status: false, mensaje: 'Error: La tabla no tiene la estructura correcta' };
        }
        
        // Ahora hacemos la consulta
        const [rows] = await conexion.query(
            `SELECT * FROM ?? WHERE email = ?`,
            [tabla, user]
        );

        if (rows.length === 0) {
            console.log(`Usuario ${user} no encontrado`);
            return { status: false, mensaje: 'Usuario no encontrado' };
        }

        const usuarioBD = rows[0];
        console.log(`Usuario encontrado: ${usuarioBD.nombre || usuarioBD.email}`);
        
        if (!usuarioBD.pw) {
            console.error('El usuario no tiene contraseña almacenada');
            return { status: false, mensaje: 'Error: Usuario sin contraseña' };
        }
        
        const coincide = await bcrypt.compare(password, usuarioBD.pw);

        if (coincide) {
            console.log('Login exitoso');
            // No devolver la contraseña en la respuesta
            const { pw, ...usuarioSinPw } = usuarioBD;
            return { status: true, user: usuarioSinPw };
        } else {
            console.log('Contraseña incorrecta');
            return { status: false, mensaje: 'Contraseña incorrecta' };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { status: false, mensaje: `Error del servidor: ${error.message}` };
    }
}


module.exports = { uno, todos, agregar, eliminar, login, insertar, actualizar };