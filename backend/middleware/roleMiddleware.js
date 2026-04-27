const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access forbidden: User role not found" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access forbidden: Role ${req.user.role} is not authorized` });
    }

    next();
  };
};

module.exports = authorizeRoles;
