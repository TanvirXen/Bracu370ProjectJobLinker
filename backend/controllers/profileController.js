const pool = require("../models/db");

exports.getProfile = async (req, res) => {
  const { userId, role } = req.user; // extracted from token
  const conn = await pool.getConnection();

  try {
    let profile = {};

    // Get common user fields
    const [userData] = await conn.query(
      `SELECT name, email FROM users WHERE id = ?`,
      [userId]
    );

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = userData;
    profile.name = name;
    profile.email = email;
    profile.role = role;

    if (role === 'candidate') {
      const [rows] = await conn.query(
        `SELECT bio, location, experience_years, education, updated_at 
         FROM candidate_profiles WHERE user_id = ?`,
        [userId]
      );

      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: 'Candidate profile not found' });
      }

      Object.assign(profile, rows);
    } else if (role === 'employer') {
      const [rows] = await conn.query(
        `SELECT company_name, company_website, job_title, updated_at 
         FROM recruiter_profiles WHERE user_id = ?`,
        [userId]
      );

      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: 'Recruiter profile not found' });
      }

      Object.assign(profile, rows);
    } else {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  } finally {
    conn.release();
  }
};
exports.updateProfile = async (req, res) => {
  const { userId, role } = req.user;
  const conn = await pool.getConnection();

  try {
    const { name } = req.body;

    if (name && name.trim() !== "") {
      await conn.query(
        `UPDATE users SET name = ? WHERE id = ?`,
        [name.trim(), userId]
      );
    }

    if (role === "candidate") {
      const { bio, location, experience_years, education } = req.body;
      await conn.query(
        `UPDATE candidate_profiles 
         SET bio = ?, location = ?, experience_years = ?, education = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = ?`,
        [bio, location, experience_years, education, userId]
      );
    } else if (role === "employer") {
      const { company_name, company_website, job_title } = req.body;
      await conn.query(
        `UPDATE recruiter_profiles 
         SET company_name = ?, company_website = ?, job_title = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = ?`,
        [company_name, company_website, job_title, userId]
      );
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    const [userData] = await conn.query(
      `SELECT name, email FROM users WHERE id = ?`,
      [userId]
    );

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "User data not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      name: userData.name,
      email: userData.email
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Profile update failed",
      error: err.message
    });
  } finally {
    conn.release();
  }
};