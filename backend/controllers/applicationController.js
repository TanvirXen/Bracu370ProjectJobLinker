const pool = require('../models/db');
function convertBigIntToString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj instanceof Date) {
    return obj.toISOString(); // ✅ preserve proper date string
  } else if (obj && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === "bigint") {
        acc[key] = value.toString();
      } else {
        acc[key] = convertBigIntToString(value);
      }
      return acc;
    }, {});
  }
  return obj;
}
// 📥 Create Application
exports.createApplication = async (req, res) => {
  const { job_id } = req.body;
  const { userId, role } = req.user;

  if (role !== 'candidate') {
    return res.status(403).json({ message: 'Only candidates can apply' });
  }

  if (!job_id) {
    return res.status(400).json({ message: 'Missing job_id' });
  }

  try {
    const conn = await pool.getConnection();

    // Check if already applied
    const existing = await conn.query(
      `SELECT * FROM applications WHERE job_id = ? AND candidate_id = ?`,
      [job_id, userId]
    );

    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({ message: 'Already applied to this job' });
    }

    await conn.query(
      `INSERT INTO applications (job_id, candidate_id, status) VALUES (?, ?, 'applied')`,
      [job_id, userId]
    );

    conn.release();
    return res.status(201).json({ message: 'Application submitted successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to apply' });
  }
};

// 📋 Get Applications (role-based)
exports.getApplications = async (req, res) => {
  const { userId, role } = req.user;

  try {
    const conn = await pool.getConnection();
    let applications = [];

    if (role === 'candidate') {
      // Candidate — get jobs they've applied to
      applications = await conn.query(`
        SELECT a.*, j.title, j.location, j.description, j.salary, j.status AS job_status,
               rp.company_name
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN recruiter_profiles rp ON j.employer_id = rp.user_id
        WHERE a.candidate_id = ?
        ORDER BY a.applied_at DESC
      `, [userId]);

    } else if (role === 'employer') {
      // Employer — get applications on their jobs
      applications = await conn.query(`
        SELECT a.*, j.title, u.name AS candidate_name, u.email, cp.location AS candidate_location, cp.experience_years
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.candidate_id = u.id
        LEFT JOIN candidate_profiles cp ON u.id = cp.user_id
        WHERE j.employer_id = ?
        ORDER BY a.applied_at DESC
      `, [userId]);

    } else {
      conn.release();
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    conn.release();
return res.json(convertBigIntToString(applications));

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch applications' });
  }
};
