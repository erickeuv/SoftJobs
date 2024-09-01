const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database');

const registrarUsuario = async (req, res, next) => {
  try {
    const { email, password, rol, lenguage } = req.body;

    // Verificar si el correo electrónico ya esta
    const existingUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Cifrar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const newUser = await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hashedPassword, rol, lenguage]
    );

    // Generar un token JWT y devolverlo
    const token = jwt.sign({ email: newUser.rows[0].email }, 'tu_clave_secreta', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

const loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verificar credenciales
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT y devolverlo al cliente
    const token = jwt.sign({ email: user.rows[0].email }, 'tu_clave_secreta', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const obtenerUsuarios = async (req, res, next) => {
  try {
    const users = await pool.query('SELECT * FROM usuarios');
    res.status(200).json(users.rows);
  } catch (error) {
    next(error);
  }
};

const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
};