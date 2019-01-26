const path = require('path');
const exhbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const errorHandler = require('errorhandler');

const routes = require('../routes/index.js');

module.exports = app => {
  // SETTINGS
  // It will use the configuration of the port in env or, if it is not indicated, it will use port 3000
  app.set('port', process.env.PORT || 3000);
  // Esto solo es necesario si se mete views dentro de otra carpeta como src
  app.set('views', path.join(__dirname, '../views'));
  // Handlebars
  // Se indica la extensión que van a tener los archivos, es de libre elección, en este caso 'hbs'
  // En principio tiene que ser la misma en los dos sitios.
  // Los helpers en handlebars son diferentes de los helpers de la app - no confundir
  app.engine(
    '.hbs',
    exhbs({
      defaultLayout: 'main',
      partialsDir: path.join(app.get('views'), 'partials'),
      layoutsDir: path.join(app.get('views'), 'layouts'),
      extname: '.hbs',
      helpers: require('./helpers'),
    }),
  );
  app.set('view engine', '.hbs');

  // MIDDLEWARES
  app.use(morgan('dev'));
  // El nombre image es de libre elección, y es como se podrá llamar luego el objeto para saber las propiedades de la imagen subida. En el formulario necesitará un atributo en el input que sea name="image"
  app.use(
    multer({ dest: path.join(__dirname, '../public/upload/temp') }).single(
      'image',
    ),
  );
  // Para poder recibir los datos que vienen desde los formularios
  app.use(express.urlencoded({ extended: false }));
  // Para poder hacer peticiones ajax, necesitamos poder manejar objetos json ( los likes en la app )
  app.use(express.json());

  // ROUTES
  routes(app);

  // STATIC FILES
  // El primer parámetro es opcional ( '/public' )
  app.use('/public', express.static(path.join(__dirname, '../public')));

  // ERRORHANDLERS
  // Solo nos interesa usar este módulo en desarrollo, en producción hay mejores maneras de manejar errores
  if (app.get('env') === 'development') {
    app.use(errorHandler);
  }

  return app;
};
