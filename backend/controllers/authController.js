
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');
const pool = require('../models/db');
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  let conn;

  if (!['candidate', 'employer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // FIXED: use proper result destructuring
    const result = await conn.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, role]
    );

    const userId = result.insertId;

    if (role === 'candidate') {
      await conn.query('INSERT INTO candidate_profiles (user_id) VALUES (?)', [userId]);
    } else if (role === 'employer') {
      await conn.query('INSERT INTO recruiter_profiles (user_id) VALUES (?)', [userId]);
    }

    await conn.commit();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    if (conn) await conn.rollback();
    res.status(500).json({ message: 'Registration failed' });
  } finally {
    if (conn) conn.release();
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  let conn;
  
  try {
    conn = await pool.getConnection();

    const users = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) {
      conn.release();
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      conn.release();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    // Store the token in the database
    await conn.query('UPDATE users SET jwt_token = ? WHERE id = ?', [token, user.id]);

    conn.release();
    res.json({ token });

  } catch (err) {
    console.error(err);
    if (conn) conn.release();
    res.status(500).json({ message: 'Login failed' });
  }
};
