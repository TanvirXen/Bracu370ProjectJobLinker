const pool = require("../models/db");

function convertBigIntToString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj instanceof Date) {
    return obj.toISOString(); 
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
exports.getJobByIdCid = async (req, res) => {
 const { id ,cid} = req.params;
  const  userId  = cid;
const role="candidate"
  try {
    const conn = await pool.getConnection();

    const jobRows = await conn.query(`
      SELECT j.*, rp.company_name, rp.company_website
      FROM jobs j
      JOIN recruiter_profiles rp ON j.employer_id = rp.user_id
      WHERE j.id = ?
    `, [id]);

    if (jobRows.length === 0) {
      conn.release();
      return res.status(404).json({ message: "Job not found" });
    }

    const job = jobRows[0];

    if (role === "candidate") {

      const candidateRows = await conn.query(
        `SELECT location FROM candidate_profiles WHERE user_id = ?`,
        [userId]
      );
      const candidate = candidateRows[0];


      const candidateSkillsRows = await conn.query(`
        SELECT cs.skill_id, cs.proficiency_level, s.name
        FROM candidate_skills cs
        JOIN skills s ON cs.skill_id = s.id
        WHERE cs.user_id = ?
      `, [userId]);

      const candidateSkills = candidateSkillsRows || [];

      const jobSkillsRows = await conn.query(`
        SELECT js.skill_id, js.required_level, s.name
        FROM job_skills js
        JOIN skills s ON js.skill_id = s.id
        WHERE js.job_id = ?
      `, [id]);

      const jobSkills = jobSkillsRows || [];

      let matched = 0;
      const skillMatches = jobSkills.map(js => {
        const candidateSkill = candidateSkills.find(cs => cs.skill_id === js.skill_id);
        const candidateLevel = candidateSkill ? candidateSkill.proficiency_level : 0;
        const matchPercent = ((Math.min(candidateLevel, js.required_level) / js.required_level) * 100).toFixed(2);

        matched += Math.min(candidateLevel, js.required_level) / js.required_level;

        return {
          skillName: js.name,
          requiredLevel: js.required_level,
          candidateLevel,
          matchPercentage: matchPercent
        };
      });

      const skillMatchPercentage = jobSkills.length > 0
        ? (matched / jobSkills.length) * 100
        : 0;


      const locationMatch = job?.location?.trim().toLowerCase() === candidate?.location?.trim().toLowerCase() ? 100 : 0;

      const overallMatch = (skillMatchPercentage * 0.7 + locationMatch * 0.3).toFixed(2);

      conn.release();
      console.log(job)
      return res.json(convertBigIntToString({
        ...job,
        jobSkills: jobSkills.map(js => ({
          skillName: js.name,
          requiredLevel: js.required_level
        })),
        match: {
          skillMatchPercentage: skillMatchPercentage.toFixed(2),
          locationMatchPercentage: locationMatch,
          overallMatchPercentage: overallMatch,
          skills: skillMatches,

        }
      }));

    } else if (role === "employer") {
      const ownJob = job.employer_id.toString() === userId.toString();
      let applications = [];
      const jobSkillsRows = await conn.query(`
        SELECT js.skill_id, js.required_level, s.name
        FROM job_skills js
        JOIN skills s ON js.skill_id = s.id
        WHERE js.job_id = ?
      `, [id]);

      const jobSkills = jobSkillsRows || [];
      if (ownJob) {
        applications = await conn.query(`
          SELECT a.*, u.name, u.email, cp.location, cp.experience_years
          FROM applications a
          JOIN users u ON a.candidate_id = u.id
          LEFT JOIN candidate_profiles cp ON cp.user_id = u.id
          WHERE a.job_id = ?
        `, [id]);
      }

      conn.release();

      return res.json(convertBigIntToString({
        ...job,
        jobSkills: jobSkills.map(js => ({
          skillName: js.name,
          requiredLevel: js.required_level
        })),
        ownJob,
        applications,

      }));
    } else {
      conn.release();
      return res.status(403).json({ message: "Unauthorized role" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch job" });
  }
};

exports.getJobById = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;

  try {
    const conn = await pool.getConnection();

    const jobRows = await conn.query(`
      SELECT j.*, rp.company_name, rp.company_website
      FROM jobs j
      JOIN recruiter_profiles rp ON j.employer_id = rp.user_id
      WHERE j.id = ?
    `, [id]);

    if (jobRows.length === 0) {
      conn.release();
      return res.status(404).json({ message: "Job not found" });
    }

    const job = jobRows[0];

    if (role === "candidate") {

      const candidateRows = await conn.query(
        `SELECT location FROM candidate_profiles WHERE user_id = ?`,
        [userId]
      );
      const candidate = candidateRows[0];

      const candidateSkillsRows = await conn.query(`
        SELECT cs.skill_id, cs.proficiency_level, s.name
        FROM candidate_skills cs
        JOIN skills s ON cs.skill_id = s.id
        WHERE cs.user_id = ?
      `, [userId]);

      const candidateSkills = candidateSkillsRows || [];

 
      const jobSkillsRows = await conn.query(`
        SELECT js.skill_id, js.required_level, s.name
        FROM job_skills js
        JOIN skills s ON js.skill_id = s.id
        WHERE js.job_id = ?
      `, [id]);

      const jobSkills = jobSkillsRows || [];

      let matched = 0;
      const skillMatches = jobSkills.map(js => {
        const candidateSkill = candidateSkills.find(cs => cs.skill_id === js.skill_id);
        const candidateLevel = candidateSkill ? candidateSkill.proficiency_level : 0;
        const matchPercent = ((Math.min(candidateLevel, js.required_level) / js.required_level) * 100).toFixed(2);

        matched += Math.min(candidateLevel, js.required_level) / js.required_level;

        return {
          skillName: js.name,
          requiredLevel: js.required_level,
          candidateLevel,
          matchPercentage: matchPercent
        };
      });

      const skillMatchPercentage = jobSkills.length > 0
        ? (matched / jobSkills.length) * 100
        : 0;



      const locationMatch = job?.location?.trim().toLowerCase() === candidate?.location?.trim().toLowerCase() ? 100 : 0;

      const overallMatch = (skillMatchPercentage * 0.7 + locationMatch * 0.3).toFixed(2);

      conn.release();
      console.log(job)
      return res.json(convertBigIntToString({
        ...job,
        jobSkills: jobSkills.map(js => ({
          skillName: js.name,
          requiredLevel: js.required_level
        })),
        match: {
          skillMatchPercentage: skillMatchPercentage.toFixed(2),
          locationMatchPercentage: locationMatch,
          overallMatchPercentage: overallMatch,
          skills: skillMatches,

        }
      }));

    } else if (role === "employer") {
      const ownJob = job.employer_id.toString() === userId.toString();
      let applications = [];
      const jobSkillsRows = await conn.query(`
        SELECT js.skill_id, js.required_level, s.name
        FROM job_skills js
        JOIN skills s ON js.skill_id = s.id
        WHERE js.job_id = ?
      `, [id]);

      const jobSkills = jobSkillsRows || [];
      if (ownJob) {
        applications = await conn.query(`
          SELECT a.*, u.name, u.email, cp.location, cp.experience_years
          FROM applications a
          JOIN users u ON a.candidate_id = u.id
          LEFT JOIN candidate_profiles cp ON cp.user_id = u.id
          WHERE a.job_id = ?
        `, [id]);
      }

      conn.release();

      return res.json(convertBigIntToString({
        ...job,
        jobSkills: jobSkills.map(js => ({
          skillName: js.name,
          requiredLevel: js.required_level
        })),
        ownJob,
        applications,

      }));
    } else {
      conn.release();
      return res.status(403).json({ message: "Unauthorized role" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch job" });
  }
};

exports.getAllJobs = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

const jobRows = await conn.query(`SELECT * FROM jobs ORDER BY posted_at DESC`);

    const jobs = jobRows.map((job) => {
      const converted = {};
      for (const key in job) {
        converted[key] = typeof job[key] === "bigint" ? Number(job[key]) : job[key];
      }
      return converted;
    });

    const jobIds = jobs.map((job) => job.id);

    let jobSkillsMap = {};

    if (jobIds.length > 0) {
      const skillRows = await conn.query(
        `SELECT js.job_id, js.required_level, s.id AS skill_id, s.name AS skill_name
         FROM job_skills js
         JOIN skills s ON js.skill_id = s.id
         WHERE js.job_id IN (${jobIds.map(() => '?').join(',')})`,
        jobIds
      );

      jobSkillsMap = skillRows.reduce((acc, row) => {
        const jobId = Number(row.job_id);
        if (!acc[jobId]) acc[jobId] = [];
        acc[jobId].push({
          skill_id: Number(row.skill_id),
          name: row.skill_name,
          required_level: row.required_level
        });
        return acc;
      }, {});
    }

    const jobsWithSkills = jobs.map((job) => ({
      ...job,
      skills: jobSkillsMap[job.id] || []
    }));

    res.status(200).json({ jobs: jobsWithSkills });

  } catch (err) {
    console.error("❌ Error in getAllJobs:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  } finally {
    if (conn) conn.release();
  }
};
exports.getAllJobsEmployer = async (req, res) => {
  const { userId, role } = req.user;

  if (role !== "employer") {
    return res.status(403).json({ message: "Access denied: Only employers can view their job listings." });
  }

  try {
    const conn = await pool.getConnection();

    const jobRows = await conn.query(
      `SELECT * FROM jobs WHERE employer_id = ? ORDER BY posted_at DESC`,
      [userId]
    );


    const jobs = jobRows.map((job) => {
      const converted = {};
      for (const key in job) {
        converted[key] =
          typeof job[key] === "bigint" ? Number(job[key]) : job[key];
      }
      return converted;
    });

    const jobIds = jobs.map((job) => job.id);

    let jobSkillsMap = {};

    if (jobIds.length > 0) {
      const skillRows = await conn.query(
        `SELECT js.job_id, js.required_level, s.id AS skill_id, s.name AS skill_name
         FROM job_skills js
         JOIN skills s ON js.skill_id = s.id
         WHERE js.job_id IN (${jobIds.map(() => '?').join(',')})`,
        jobIds
      );

      jobSkillsMap = skillRows.reduce((acc, row) => {
        const jobId = Number(row.job_id);
        if (!acc[jobId]) acc[jobId] = [];
        acc[jobId].push({
          skill_id: Number(row.skill_id),
          name: row.skill_name,
          required_level: row.required_level
        });
        return acc;
      }, {});
    }


    const jobsWithSkills = jobs.map((job) => ({
      ...job,
      skills: jobSkillsMap[job.id] || []
    }));

    conn.release();

    res.status(200).json({ jobs: jobsWithSkills });
  } catch (err) {
    console.error("getAllJobs error:", err);
    res.status(500).json({ message: "Failed to fetch employer's jobs" });
  }
};

exports.createJob = async (req, res) => {
  const { userId } = req.user; 
  const {
    title,
    description,
    location,
    experience_required,
    salary,
    status = "open",
  } = req.body;

  if (!title || !description || !location || experience_required == null) {
    return res.status(400).json({ message: "Missing required job fields" });
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO jobs (employer_id, title, description, location, experience_required, status,salary)
         VALUES (?, ?, ?, ?, ?, ?,?)`,
      [userId, title, description, location, experience_required, status, salary]
    );

    console.log("MySQL result:", result); 
    const jobId = Number(result.insertId);
    console.log("Created job with ID:", jobId);


    const [jobs] = await conn.query("SELECT id FROM jobs WHERE id = ?", [
      jobId,
    ]);
    console.log("Verification query result:", jobs);

    if (!jobs || jobs.length === 0) {
      throw new Error("Failed to verify job creation");
    }

    const responseData = {
      message: "Job listing created successfully",
      jobId: jobId,
    };
    console.log("Sending response:", responseData); 

    conn.release();
    res.status(201).json(responseData);
  } catch (err) {
    console.error("Error in createJob:", err);
    res.status(500).json({ message: "Failed to create job listing" });
  }
};

exports.addJobSkills = async (req, res) => {
  const { userId } = req.user;
  const { jobId } = req.params;
  const { skills } = req.body;

  console.log("Adding skills for job:", jobId);
  console.log("Skills data:", skills); 


  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ message: "Skills array is required" });
  }

  try {
    const conn = await pool.getConnection();

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


    const [existing] = await conn.query(
      "SELECT * FROM applications WHERE job_id = ? AND candidate_id = ?",
      [jobId, userId]
    );
    if (existing.length > 0) {
      conn.release();
      return res.status(400).json({ message: "Already applied to this job" });
    }

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

    const [candidateSkills] = await conn.query(
      `SELECT skill_id, proficiency_level
         FROM candidate_skills
         WHERE user_id = ?`,
      [userId]
    );


    const candidateSkillMap = new Map();
    candidateSkills.forEach((skill) => {
      candidateSkillMap.set(skill.skill_id, skill.proficiency_level);
    });

    let totalWeight = 0;
    let matchedWeight = 0;

    requiredSkills.forEach((reqSkill) => {
      totalWeight += reqSkill.required_level;
      const candidateLevel = candidateSkillMap.get(reqSkill.skill_id) || 0;
      matchedWeight += Math.min(candidateLevel, reqSkill.required_level);
    });

    const score =
      totalWeight > 0 ? ((matchedWeight / totalWeight) * 100).toFixed(2) : 0;


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
