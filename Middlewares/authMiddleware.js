const jwt = require('jsonwebtoken');

const verificarCredenciales = (req, res, next) => {
    next();
};

const validarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificar la validez del token usando la misma llave secreta usada en su firma
    const decodedToken = jwt.verify(token, 'tu_clave_secreta');

    // Decodificar el token para obtener el email del usuario a buscar en su payload
    req.usuario = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = {
  verificarCredenciales,
  validarToken,
};