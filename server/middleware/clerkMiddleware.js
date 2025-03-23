const { requireAuth } = require('@clerk/clerk-sdk-node');

const clerkAuth = requireAuth();

const requireAdmin = (req, res, next) => {
  if (!req.auth || !req.auth.userId || req.auth.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { clerkAuth, requireAdmin };
