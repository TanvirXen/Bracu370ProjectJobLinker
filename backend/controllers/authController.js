
const bcrypt = require('bcryptjs');
const pool = require('../models/db');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
const { name, email, password, role, company_name, company_website, job_title } = req.body;
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
await conn.query(
  'INSERT INTO recruiter_profiles (user_id, company_name, company_website, job_title) VALUES (?, ?, ?, ?)',
  [userId, company_name, company_website || null, job_title || null]
);
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

    // Step 1: Get profile ID from respective table
    let profileId = null;

    if (user.role === 'candidate') {
      const [candidate] = await conn.query('SELECT user_id FROM candidate_profiles WHERE user_id = ?', [user.id]);
      if (candidate.length > 0) profileId = candidate[0].user_id;
    } else if (user.role === 'employer') {
      const [recruiter] = await conn.query('SELECT user_id FROM recruiter_profiles WHERE user_id = ?', [user.id]);
      if (recruiter.length > 0) profileId = recruiter[0].user_id;
    }

    // Step 2: Generate token with profileId
    const token = jwt.sign(
      {
        id: Number(user.id),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Step 3: Store token
    await conn.query('UPDATE users SET jwt_token = ? WHERE id = ?', [token, user.id]);

    conn.release();

    // Send token, role, and optionally profileId
    res.json({ token, role: user.role, profileId });

  } catch (err) {
    console.error("Login error:", err);
    if (conn) conn.release();
    res.status(500).json({ message: 'Login failed' });
  }
};