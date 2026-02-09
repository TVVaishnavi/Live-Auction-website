const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  try {
     const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];
    console.log("token: ", token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT decoded: ", decoded);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
