const express = require('express');
const config = require('./config');
const clientes = require('./molulos/clientes/rutas')
const usuario = require('./molulos/users/rutas')

const app = express();
app.use(express.json());

//Configuracion
app.set('port', config.app.port);

//Rutas
app.use('/api/clientes',clientes)
app.use('/api/usuario',usuario)




module.exports = app;
