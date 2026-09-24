import express from "express";
import db from "../database/sqlconnect.js";
import { verifyToken, requireRole, ACCESS_COLUMNS } from "../middleware/Authservice.js";

const router = express.Router();

// เฉพาะ role admin เท่านั้นที่เข้าใช้ router นี้ได้ทั้งหมด
router.use(verifyToken, requireRole("admin"));

// 1. ดูผู้ใช้ทั้งหมดพร้อม role และสิทธิ์เข้าถึงแต่ละ router
router.get("/users", (req, res) => {
  db.query(
    "SELECT id, name, email, Role, access_routermongo, access_routersqltest, created_at FROM User",
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    },
  );
});

// 2. เปลี่ยน role ของผู้ใช้
router.put("/users/:id/role", (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: "role is required" });

  db.query(
    "UPDATE User SET Role = ? WHERE id = ?",
    [role, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not Found" });
      res.json({ id: req.params.id, role });
    },
  );
});

// 3. ดูรายชื่อ router (resource) ที่กำหนดสิทธิ์ได้ทั้งหมด
router.get("/resources", (req, res) => {
  res.json(Object.keys(ACCESS_COLUMNS));
});

// 4. ตั้งค่าสิทธิ์เข้าถึง router ของผู้ใช้รายคน
router.put("/users/:id/access", (req, res) => {
  const { resource, allow } = req.body;
  const column = ACCESS_COLUMNS[resource];

  if (!column) {
    return res.status(400).json({ message: `Unknown resource '${resource}'` });
  }
  if (typeof allow !== "boolean") {
    return res.status(400).json({ message: "allow must be a boolean" });
  }

  db.query(
    `UPDATE User SET ${column} = ? WHERE id = ?`,
    [allow, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not Found" });
      res.json({ id: req.params.id, resource, allow });
    },
  );
});

export default router;
