const loggerMiddleware = (req, res, next) => {
    // Middleware para registrar las consultas recibidas en el servidor
    console.log(`Consulta recibida: ${req.method} ${req.url}`);
    next();
  };
  
  module.exports = loggerMiddleware;