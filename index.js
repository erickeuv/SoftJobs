const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const userController = require('./Controller/userController.js');
const authMiddleware = require('./Middlewares/authMiddleware.js');
const errorMiddleware = require('./Middlewares/errorMiddleware.js');
const loggerMiddleware = require('./Middlewares/loggerMiddleware.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(loggerMiddleware);

// Rutas
app.post('/usuarios', userController.registrarUsuario);
app.post('/login', userController.loginUsuario);
app.get('/usuarios', authMiddleware.validarToken, userController.obtenerUsuarios);
app.get('/usuarios/:id', authMiddleware.validarToken, userController.obtenerUsuarioPorId);

// Manejo de errores
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});


