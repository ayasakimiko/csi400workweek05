import express from "express";
import db from "../database/sqlconnect.js";
import { verifyToken, requireAccess } from "../middleware/Authservice.js";

const router = express.Router();

router.use(verifyToken, requireAccess("routersqltest"));

// 1. Create - เพิ่มผู้ใช้
router.post("/user", (req, res) => {
  const { name, password, email } = req.body;
  const sql = "INSERT INTO User (name, password, email) VALUES (?, ?, ?)";
  db.query(sql, [name, password, email], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// 2. Read - ดึงข้อมูลทั้งหมด
router.get("/user", (req, res) => {
  db.query("SELECT * FROM User", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// 3. Read - ดึงข้อมูลตาม id
router.get("/user/:id", (req, res) => {
  db.query(
    "SELECT * FROM User WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Not Found" });
      res.json(results[0]);
    },
  );
});

// 4. Update - แก้ไขข้อมูล
router.put("/user/:id", (req, res) => {
  const { name, password, email } = req.body;
  const sql = "UPDATE User SET name=?, password=?, email=? WHERE id=?";
  db.query(sql, [name, password, email, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Not Found" });
    res.json({ id: req.params.id, ...req.body });
  });
});

// 5. Delete - ลบผู้ใช้
router.delete("/user/:id", (req, res) => {
  db.query("DELETE FROM User WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted Successfully" });
  });
});

export default router;
