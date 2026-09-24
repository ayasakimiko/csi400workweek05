import jwt from "jsonwebtoken";
import db from "../database/sqlconnect.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const ACCESS_COLUMNS = {
  routermongo: "access_routermongo",
  routersqltest: "access_routersqltest",
};

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}

// อนุญาตเฉพาะ role ที่ระบุ
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No token provided" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient role" });
    }
    next();
  };
}

export function requireAccess(resource) {
  const column = ACCESS_COLUMNS[resource];

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No token provided" });
    if (req.user.role === "admin") return next();
    if (!column) return res.status(500).json({ message: `Unknown resource '${resource}'` });

    db.query(`SELECT ${column} FROM User WHERE id = ?`, [req.user.id], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0 || !results[0][column]) {
        return res
          .status(403)
          .json({ message: `You don't have access to '${resource}'` });
      }
      next();
    });
  };
}

export default { generateToken, verifyToken, requireRole, requireAccess, ACCESS_COLUMNS };
