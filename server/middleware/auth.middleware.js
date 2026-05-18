// middleware/auth.middleware.js

/**
 * isAuthenticated — requires a valid session (user must be logged in)
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
};

/**
 * authorizeRoles(...roles) — restricts access to specific roles
 * Usage: authorizeRoles("admin")  or  authorizeRoles("admin", "exhibitor")
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { isAuthenticated, authorizeRoles };
