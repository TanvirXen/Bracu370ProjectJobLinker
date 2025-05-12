
const pool = require('../models/db');

exports.createSkill = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Skill name is required' });

  try {
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO skills (name) VALUES (?)', [name.trim()]);
    conn.release();
    res.status(201).json({ message: 'Skill created successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Skill already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create skill' });
    }
  }
};

exports.deleteSkill = async (req, res) => {
  const skillId = req.params.id;
  if (!skillId) return res.status(400).json({ message: 'Skill ID is required' });

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query('DELETE FROM skills WHERE id = ?', [skillId]);
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete skill' });
  }
};

// POST /candidate-skills
exports.addSkillToCandidate = async (req, res) => {
  const { userId, role } = req.user;
  const { skill_id, proficiency_level } = req.body;

  if (role !== 'candidate') {
    return res.status(403).json({ message: 'Only candidates can assign skills to themselves' });
  }

  if (!skill_id || !proficiency_level) {
    return res.status(400).json({ message: 'Skill ID and proficiency level are required' });
  }

  try {
    const conn = await pool.getConnection();

    await conn.query(
      `INSERT INTO candidate_skills (user_id, skill_id, proficiency_level)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE proficiency_level = VALUES(proficiency_level)`,
      [userId, skill_id, proficiency_level]
    );

    conn.release();
    res.status(201).json({ message: 'Skill added/updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add skill' });
  }
};
// GET /candidate-skills/:userId
exports.getCandidateSkills = async (req, res) => {
  const { userId, role } = req.user; // extracted from token

  if (role !== 'candidate') {
    return res.status(403).json({ message: 'Access denied: Not a candidate' });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const skills = await conn.query(
      `SELECT cs.skill_id, s.name AS skill_name, cs.proficiency_level
       FROM candidate_skills cs
       JOIN skills s ON cs.skill_id = s.id
       WHERE cs.user_id = ?`,
      [userId]
    );
    res.status(200).json({ skills });
  } catch (err) {
    console.error("Candidate Skills Fetch Error:", err);
    res.status(500).json({ message: 'Failed to fetch candidate skills' });
  } finally {
    if (conn) conn.release();
  }
};
// GET /skills
exports.getAllSkills = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const skillsRaw = await conn.query('SELECT id, name FROM skills ORDER BY name ASC');
    conn.release();

    // Convert BigInt id to Number
    const skills = skillsRaw.map(skill => ({
      id: Number(skill.id),
      name: skill.name
    }));

    res.json({ skills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
};

exports.deleteCandidateSkill = async (req, res) => {
  const { userId, role } = req.user;
  const { skill_id } = req.params; // skill ID passed in the URL

  if (role !== 'candidate') {
    return res.status(403).json({ message: 'Only candidates can delete their skills' });
  }

  if (!skill_id) {
    return res.status(400).json({ message: 'Skill ID is required' });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const result = await conn.query(
      `DELETE FROM candidate_skills WHERE user_id = ? AND skill_id = ?`,
      [userId, skill_id]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill not found or already removed' });
    }

    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error("Delete Skill Error:", err);
    if (conn) conn.release();
    res.status(500).json({ message: 'Failed to delete skill' });
  }
};