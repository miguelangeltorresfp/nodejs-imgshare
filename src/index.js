const express = require('express');
const config = require('./server/config');

// DATABASE
// Primero se ejecuta la base de datos y luego la aplicación del servidor.
require('./database');

// APP SETTINGS
// Se pasa el objeto devuelto al ejecutar express, esto es la app a la función config
const app = config(express());

// INIT SERVER
app.listen(app.get('port'), () => {
  console.log('Server on port: ', app.get('port'));
});
