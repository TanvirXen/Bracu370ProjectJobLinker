// middleware/roleCheck.js
const roleCheck = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Access forbidden: incorrect role' });
    }
    next();
  };
};

module.exports = { roleCheck };
