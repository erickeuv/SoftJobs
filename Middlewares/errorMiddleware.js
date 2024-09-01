const errorMiddleware = (err, req, res, next) => {
    // Middleware para manejar errores
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  };
  
  module.exports = errorMiddleware;