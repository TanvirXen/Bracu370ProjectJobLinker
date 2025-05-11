const pool = require("../models/db");
exports.getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await pool.getConnection();
    const [jobs] = await conn.query("SELECT * FROM jobs WHERE id = ?", [id]);
    conn.release();

    if (jobs.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(jobs[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};
// GET /jobs
exports.getAllJobs = async (req, res) => {
  const { page, limit, status } = req.query;

  let sql = "SELECT * FROM jobs";
  const params = [];

  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }

  sql += " ORDER BY posted_at DESC";

  // If pagination params provided
  if (page && limit) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);
  }

  try {
    const conn = await pool.getConnection();
    const [jobs] = await conn.query(sql, params);
    conn.release();
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};
// POST /jobs (employer only)
exports.createJob = async (req, res) => {
  const { userId } = req.user; // role already verified by middleware
  const {
    title,
    description,
    location,
    experience_required,
    status = "open",
  } = req.body;

  if (!title || !description || !location || experience_required == null) {
    return res.status(400).json({ message: "Missing required job fields" });
  }

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO jobs (employer_id, title, description, location, experience_required, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, description, location, experience_required, status]
    );

    console.log("MySQL result:", result); // Debug log
    const jobId = result.insertId;
    console.log("Created job with ID:", jobId); // Debug log

    // Verify the job was created by fetching it
    const [jobs] = await conn.query("SELECT id FROM jobs WHERE id = ?", [
      jobId,
    ]);
    console.log("Verification query result:", jobs); // Debug log

    if (!jobs || jobs.length === 0) {
      throw new Error("Failed to verify job creation");
    }

    const responseData = {
      message: "Job listing created successfully",
      jobId: jobId,
    };
    console.log("Sending response:", responseData); // Debug log

    conn.release();
    res.status(201).json(responseData);
  } catch (err) {
    console.error("Error in createJob:", err);
    res.status(500).json({ message: "Failed to create job listing" });
  }
};
// POST /jobs/:jobId/skills
exports.addJobSkills = async (req, res) => {
  const { userId } = req.user;
  const { jobId } = req.params;
  const { skills } = req.body;

  console.log("Adding skills for job:", jobId); // Debug log
  console.log("Skills data:", skills); // Debug log

  // Validate skills array
  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ message: "Skills array is required" });
  }

  try {
    const conn = await pool.getConnection();

    // Check if job exists and belongs to current user
    const [jobs] = await conn.query(
      "SELECT * FROM jobs WHERE id = ? AND employer_id = ?",
      [jobId, userId]
    );
    if (jobs.length === 0) {
      conn.release();
      return res
        .status(403)
        .json({ message: "Unauthorized to modify this job or job not found" });
    }

    // Insert skills using ON DUPLICATE to allow updates
    const insertPromises = skills.map(({ skill_id, required_level }) => {
      return conn.query(
        `INSERT INTO job_skills (job_id, skill_id, required_level)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE required_level = VALUES(required_level)`,
        [jobId, skill_id, required_level]
      );
    });

    await Promise.all(insertPromises);
    conn.release();

    res.status(201).json({ message: "Job skills added/updated successfully" });
  } catch (err) {
    console.error("Error in addJobSkills:", err);
    res.status(500).json({ message: "Failed to add job skills" });
  }
};
// POST /jobs/:jobId/apply
exports.applyForJob = async (req, res) => {
  const { userId, role } = req.user;
  const { jobId } = req.params;

  if (role !== "candidate") {
    return res
      .status(403)
      .json({ message: "Only candidates can apply for jobs" });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    // Check if already applied
    const [existing] = await conn.query(
      "SELECT * FROM applications WHERE job_id = ? AND candidate_id = ?",
      [jobId, userId]
    );
    if (existing.length > 0) {
      conn.release();
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // Fetch job required skills
    const [requiredSkills] = await conn.query(
      `SELECT js.skill_id, js.required_level
         FROM job_skills js
         WHERE js.job_id = ?`,
      [jobId]
    );

    if (requiredSkills.length === 0) {
      return res
        .status(400)
        .json({ message: "Job has no defined required skills" });
    }

    // Fetch candidate skills
    const [candidateSkills] = await conn.query(
      `SELECT skill_id, proficiency_level
         FROM candidate_skills
         WHERE user_id = ?`,
      [userId]
    );

    // Map candidate skills for fast lookup
    const candidateSkillMap = new Map();
    candidateSkills.forEach((skill) => {
      candidateSkillMap.set(skill.skill_id, skill.proficiency_level);
    });

    // Calculate score (weighted match %)
    let totalWeight = 0;
    let matchedWeight = 0;

    requiredSkills.forEach((reqSkill) => {
      totalWeight += reqSkill.required_level;
      const candidateLevel = candidateSkillMap.get(reqSkill.skill_id) || 0;
      matchedWeight += Math.min(candidateLevel, reqSkill.required_level);
    });

    const score =
      totalWeight > 0 ? ((matchedWeight / totalWeight) * 100).toFixed(2) : 0;

    // Insert application
    await conn.query(
      `INSERT INTO applications (job_id, candidate_id, status, score)
         VALUES (?, ?, 'applied', ?)`,
      [jobId, userId, score]
    );

    conn.release();
    res
      .status(201)
      .json({ message: "Applied successfully", score: parseFloat(score) });
  } catch (err) {
    console.error(err);
    if (conn) conn.release();
    res.status(500).json({ message: "Job application failed" });
  }
};
