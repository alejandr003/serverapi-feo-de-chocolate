const bd = require('../../BD/mysqlv2');

const TABLA = 'luces';

async function todos() {
    try {
        return await bd.todos(TABLA);
    } catch (error) {
        console.error("Error en todos/luces:", error);
        return { status: false, mensaje: "Error al consultar luces" };
    }
}

async function uno(id) {
    try {
        const result = await bd.uno(TABLA, id);
        if (!result) {
            return { status: false, mensaje: "Luz no encontrada" };
        }
        return { status: true, data: result };
    } catch (error) {
        console.error("Error en uno/luces:", error);
        return { status: false, mensaje: "Error al consultar luz" };
    }
}

async function agregar(body) {
    try {
        if (!body.ubicacion || body.estatus === undefined) {
            return { status: false, mensaje: 'Faltan datos obligatorios (ubicacion y estatus)' };
        }
        
        // Convertir a número entero si es true/false o 1/0
        let estatusValor;
        if (typeof body.estatus === 'boolean') {
            estatusValor = body.estatus ? 1 : 0;
        } else {
            estatusValor = parseInt(body.estatus);
            if (isNaN(estatusValor)) {
                estatusValor = 0; // Valor por defecto si no se puede convertir
            }
        }
        
        // Para nuevos registros, no incluimos el id (dejamos que MySQL asigne uno automáticamente)
        const nuevaLuz = {
            ubicacion: body.ubicacion,
            estatus: estatusValor
        };
        
        // Solo incluimos el id si es para actualizar un registro existente
        if (body.id && parseInt(body.id) > 0) {
            nuevaLuz.id = parseInt(body.id);
        }
        
        console.log("Datos a insertar:", nuevaLuz);
        return await bd.agregar(TABLA, nuevaLuz);
    } catch (error) {
        console.error("Error en agregar/luces:", error);
        return { status: false, mensaje: "Error al agregar luz" };
    }
}

async function eliminar(body) {
    try {
        if (!body || !body.id) {
            return { status: false, mensaje: 'Falta el ID para eliminar' };
        }
        return await bd.eliminar(TABLA, body);
    } catch (error) {
        console.error("Error en eliminar/luces:", error);
        return { status: false, mensaje: "Error al eliminar luz" };
    }
}

module.exports = {
    todos, uno, agregar, eliminar
};
