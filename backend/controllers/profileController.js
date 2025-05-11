const pool = require("../models/db");

exports.getProfile = async (req, res) => {
  const { userId, role } = req.user;
  const conn = await pool.getConnection();

  try {
    let profile;
    if (role === "candidate") {
      // Get candidate profile with skills
      const [profileData] = await conn.query(
        `SELECT cp.*, u.name, u.email, u.profile_picture,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'skill_id', cs.skill_id,
              'proficiency_level', cs.proficiency_level,
              'name', s.name
            )
          ) as skills
        FROM candidate_profiles cp
        JOIN users u ON cp.user_id = u.id
        LEFT JOIN candidate_skills cs ON cp.user_id = cs.user_id
        LEFT JOIN skills s ON cs.skill_id = s.id
        WHERE cp.user_id = ?
        GROUP BY cp.user_id`,
        [userId]
      );

      if (profileData.length === 0) {
        return res.status(404).json({ message: "Profile not found" });
      }

      profile = {
        ...profileData[0],
        role: "candidate",
        skills: profileData[0].skills[0]
          ? JSON.parse(profileData[0].skills)
          : [],
      };
    } else if (role === "employer") {
      // Get recruiter profile
      const [profileData] = await conn.query(
        `SELECT rp.*, u.name, u.email, u.profile_picture
        FROM recruiter_profiles rp
        JOIN users u ON rp.user_id = u.id
        WHERE rp.user_id = ?`,
        [userId]
      );

      if (profileData.length === 0) {
        return res.status(404).json({ message: "Profile not found" });
      }

      profile = {
        ...profileData[0],
        role: "recruiter",
      };
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    // Get contact info
    const [contactInfo] = await conn.query(
      `SELECT phone, linkedin, github, website
      FROM contact_info
      WHERE user_id = ?`,
      [userId]
    );

    profile.contactInfo = contactInfo[0] || {};

    res.json(profile);
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: err.message });
  } finally {
    conn.release();
  }
};

exports.updateProfile = async (req, res) => {
  const { userId, role } = req.user; // Extract from token or session
  const conn = await pool.getConnection();

  try {
    if (role === "candidate") {
      const { bio, location, experience_years, education } = req.body;
      const result = await conn.query(
        `UPDATE candidate_profiles SET bio = ?, location = ?, experience_years = ?, education = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?`,
        [bio, location, experience_years, education, userId]
      );
      console.log("Update Result:", result);
    } else if (role === "employer") {
      const { company_name, company_website, job_title } = req.body;
      const result = await conn.query(
        `UPDATE recruiter_profiles SET company_name = ?, company_website = ?, job_title = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?`,
        [company_name, company_website, job_title, userId]
      );
      console.log("Update Result:", result);
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Profile update failed", error: err.message });
  } finally {
    conn.release();
  }
};
