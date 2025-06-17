const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');

router.get('/', async function (req, res) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, 200, items);
    } catch (error) {
        console.error("Error en ruta GET /:", error);
        respuesta.error(req, res, 500, 'Error al obtener datos de luces', error);
    }
});

router.get('/:id', async function (req, res) {
    try {
        const item = await controlador.uno(req.params.id);
        respuesta.success(req, res, 200, item);
    } catch (error) {
        console.error("Error en ruta GET /:id:", error);
        respuesta.error(req, res, 500, 'Error al obtener datos de la luz', error);
    }
});

router.post('/agregar', async function (req, res) {
    try {
        console.log("Recibido en /agregar:", req.body);
        const result = await controlador.agregar(req.body);
        respuesta.success(req, res, 200, result);
    } catch (error) {
        console.error("Error en ruta POST /agregar:", error);
        respuesta.error(req, res, 500, 'Error al guardar datos de luz', error);
    }
});

router.post('/eliminar', async function (req, res) {
    try {
        console.log("Recibido en /eliminar:", req.body);
        const result = await controlador.eliminar(req.body);
        respuesta.success(req, res, 200, result);
    } catch (error) {
        console.error("Error en ruta POST /eliminar:", error);
        respuesta.error(req, res, 500, 'Error al eliminar luz', error);
    }
});

module.exports = router;
