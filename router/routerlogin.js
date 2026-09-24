import express from "express";
import bcrypt from "bcrypt";
import db from "../database/sqlconnect.js";
import { generateToken, verifyToken } from "../middleware/Authservice.js";

const router = express.Router();
const SALT_ROUNDS = 10;

// 1. Register - สมัครสมาชิก
router.post("/register", (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !password || !email) {
    return res.status(400).json({ message: "name, password, email are required" });
  }

  db.query("SELECT id FROM User WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) return res.status(500).json({ message: err.message });

      const sql = "INSERT INTO User (name, password, email, Role) VALUES (?, ?, ?, 'user')";
      db.query(sql, [name, hash, email], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: result.insertId, name, email, role: "user" });
      });
    });
  });
});

// 2. Login - เข้าสู่ระบบ
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  db.query("SELECT * FROM User WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.Role,
      });
      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.Role },
      });
    });
  });
});

// 3. Me - ดึงข้อมูลผู้ใช้ปัจจุบัน
router.get("/me", verifyToken, (req, res) => {
  db.query("SELECT id, name, email, Role, created_at FROM User WHERE id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Not Found" });
    res.json(results[0]);
  });
});

export default router;
