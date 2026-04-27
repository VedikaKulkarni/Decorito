const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // Get token from headers
    const token = req.header("Authorization")?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info to req.user

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
