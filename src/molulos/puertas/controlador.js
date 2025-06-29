const bd = require('../../BD/mysqlv2');

const TABLA = 'puertas';

async function todos() {
    try {
        return await bd.todos(TABLA);
    } catch (error) {
        console.error("Error en todos/puertas:", error);
        return { status: false, mensaje: "Error al consultar puertas" };
    }
}

async function uno(id) {
    try {
        const result = await bd.uno(TABLA, id);
        if (!result) {
            return { status: false, mensaje: "Puerta no encontrada" };
        }
        return { status: true, data: result };
    } catch (error) {
        console.error("Error en uno/puertas:", error);
        return { status: false, mensaje: "Error al consultar puerta" };
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
        const nuevaPuerta = {
            ubicacion: body.ubicacion,
            estatus: estatusValor
        };
        
        // Solo incluimos el id si es para actualizar un registro existente
        if (body.id && parseInt(body.id) > 0) {
            nuevaPuerta.id = parseInt(body.id);
        }
        
        console.log("Datos a insertar:", nuevaPuerta);
        return await bd.agregar(TABLA, nuevaPuerta);
    } catch (error) {
        console.error("Error en agregar/puertas:", error);
        return { status: false, mensaje: "Error al agregar puerta" };
    }
}

async function eliminar(body) {
    try {
        if (!body || !body.id) {
            return { status: false, mensaje: 'Falta el ID para eliminar' };
        }
        return await bd.eliminar(TABLA, body);
    } catch (error) {
        console.error("Error en eliminar/puertas:", error);
        return { status: false, mensaje: "Error al eliminar puerta" };
    }
}
async function actualizar(body) {
    try {
        if (!body.id) {
            return { status: false, mensaje: 'Falta el ID obligatorio para actualizar' };
        }
        
        // Inicializamos el objeto con el ID
        const puertaActualizada = {
            id: parseInt(body.id)
        };
        
        // Solo incluimos ubicación si está presente en el body
        if (body.ubicacion !== undefined) {
            puertaActualizada.ubicacion = body.ubicacion;
        }
        
        // Solo incluimos estatus si está presente en el body
        if (body.estatus !== undefined) {
            // Convertir a número entero si es true/false o 1/0
            if (typeof body.estatus === 'boolean') {
                puertaActualizada.estatus = body.estatus ? 1 : 0;
            } else {
                const estatusValor = parseInt(body.estatus);
                puertaActualizada.estatus = isNaN(estatusValor) ? 0 : estatusValor;
            }
        }
        
        // Verificamos que haya al menos un campo para actualizar además del ID
        if (Object.keys(puertaActualizada).length <= 1) {
            return { status: false, mensaje: 'No hay campos para actualizar' };
        }
        
        console.log("Datos a actualizar:", puertaActualizada);
        return await bd.actualizar(TABLA, puertaActualizada);
    } catch (error) {
        console.error("Error en actualizar/puertas:", error);
        return { status: false, mensaje: "Error al actualizar puerta" };
    }
}
module.exports = {
    todos, uno, agregar, eliminar, actualizar
};
