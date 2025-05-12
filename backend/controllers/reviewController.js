const pool = require('../models/db');
exports.createReview = async (req, res) => {
    const { userId, role } = req.user; 
    const { reviewee_id, rating, comment } = req.body;
  
    if (!reviewee_id || !rating) {
      return res.status(400).json({ message: 'reviewee_id and rating are required' });
    }
  
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  
    try {
      const conn = await pool.getConnection();

      const [users] = await conn.query(
        'SELECT id, role FROM users WHERE id = ?',
        [reviewee_id]
      );
      const reviewee = users[0];
  
      if (!reviewee) {
        conn.release();
        return res.status(404).json({ message: 'Reviewee not found' });
      }
  
      if (reviewee.role === role) {
        conn.release();
        return res.status(400).json({ message: 'You can only review users of the opposite role' });
      }

      await conn.query(
        `INSERT INTO reviews (reviewer_id, reviewee_id, reviewer_role, rating, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, reviewee_id, role, rating, comment || null]
      );
  
      conn.release();
      res.status(201).json({ message: 'Review submitted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to submit review' });
    }
  };

exports.getReviewsForUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const conn = await pool.getConnection();
  
      const [reviews] = await conn.query(
        `SELECT r.rating, r.comment, r.created_at, u.name AS reviewer_name, r.reviewer_role
         FROM reviews r
         JOIN users u ON r.reviewer_id = u.id
         WHERE r.reviewee_id = ?
         ORDER BY r.created_at DESC`,
        [userId]
      );
  
      conn.release();
      res.json({ reviews });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  };
    