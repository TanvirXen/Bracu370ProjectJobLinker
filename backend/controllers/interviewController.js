const nodemailer = require('nodemailer');
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

exports.createInterview = async (req, res) => {
  const { application_id, interview_datetime, mode = "Online Interview" } = req.body;

  if (!application_id || !interview_datetime || !mode) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    // Get candidate email and job info
    const result = await conn.query(`
      SELECT u.email, u.name AS candidate_name, j.title AS job_title, j.description AS job_description
      FROM applications a
      JOIN users u ON a.candidate_id = u.id
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `, [application_id]);

    if (result.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Application not found' });
    }

    const candidate = result[0];

    // Insert interview record
    await conn.query(
      `INSERT INTO interviews (application_id, interview_datetime, mode, status, notification_sent)
       VALUES (?, ?, ?, 'scheduled', true)`,
      [application_id, interview_datetime, mode]
    );

    // Update application status to 'interviewed'
    await conn.query(
      `UPDATE applications SET status = 'interviewed' WHERE id = ?`,
      [application_id]
    );

    // Send email to candidate
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: candidate.email,
      subject: `Interview Scheduled for ${candidate.job_title}`,
      html: `
        <p>Hello ${candidate.candidate_name},</p>
        <p>Your interview for the job <strong>${candidate.job_title}</strong> has been scheduled.</p>
        <p><strong>Date & Time:</strong> ${new Date(interview_datetime).toLocaleString()}</p>
        <p><strong>Mode:</strong> ${mode}</p>
        <p><strong>Job Description:</strong></p>
        <p>${candidate.job_description}</p>
        <p>Good luck!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    conn.release();
    res.status(201).json({ message: 'Interview scheduled, status updated, and email sent' });

  } catch (err) {
    console.error(err);
    if (conn) conn.release();
    res.status(500).json({ message: 'Failed to schedule interview' });
  }
};
exports.updateInterview = async (req, res) => {
  const { id } = req.params;
  const { interview_datetime, mode, status } = req.body;

  if (!interview_datetime && !mode && !status) {
    return res.status(400).json({ message: 'No update fields provided' });
  }

  const fields = [];
  const values = [];

  if (interview_datetime) {
    fields.push('interview_datetime = ?');
    values.push(interview_datetime);
  }
  if (mode) {
    fields.push('mode = ?');
    values.push(mode);
  }
  if (status) {
    fields.push('status = ?');
    values.push(status);
  }

  values.push(id);

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `UPDATE interviews SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json({ message: 'Interview updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update interview' });
  }
};
exports.getUserInterviews = async (req, res) => {
  const { userId, role } = req.user;

  let conn;
  try {
    conn = await pool.getConnection();

    let query = '';
    let params = [];

    if (role === 'candidate') {
      query = `
        SELECT 
          i.id AS interview_id,
          i.interview_datetime,
          i.mode,
          i.status,
          j.title AS job_title,
          j.description AS job_description
        FROM interviews i
        JOIN applications a ON i.application_id = a.id
        JOIN jobs j ON a.job_id = j.id
        WHERE a.candidate_id = ?
        ORDER BY i.interview_datetime DESC
      `;
      params = [userId];

    } else if (role === 'employer') {
      query = `
        SELECT 
          i.id AS interview_id,
          i.interview_datetime,
          i.mode,
          i.status,
          u.name AS candidate_name,
          u.email AS candidate_email,
          j.title AS job_title,
          j.description AS job_description
        FROM interviews i
        JOIN applications a ON i.application_id = a.id
        JOIN users u ON a.candidate_id = u.id
        JOIN jobs j ON a.job_id = j.id
        WHERE j.employer_id = ?
        ORDER BY i.interview_datetime DESC
      `;
      params = [userId];

    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    const rows = await conn.query(query, params);
    res.status(200).json(convertBigIntToString({ interviews: rows }));

  } catch (err) {
    console.error("Get Interviews Error:", err);
    res.status(500).json({ message: 'Failed to retrieve interviews' });
  } finally {
    if (conn) conn.release();
  }
};