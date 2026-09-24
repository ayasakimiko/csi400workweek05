import express from "express";
import db from "../database/sqlconnect.js";
import { verifyToken, requireRole, STAFF_ROLES, READ_ROLES } from "../middleware/Authservice.js";

const router = express.Router();

const ASSET_SELECT = `
  SELECT a.id, a.asset_type, a.description, a.value, a.status,
         a.owner_id, u.name AS owner_name, u.email AS owner_email,
         a.created_at, a.updated_at
  FROM Asset a
  JOIN User u ON u.id = a.owner_id
`;

router.use(verifyToken);

router.post("/", requireRole(...STAFF_ROLES), (req, res) => {
  const { asset_type, description, value, status, owner_id } = req.body;

  if (!asset_type || !description || value === undefined || !owner_id) {
    return res
      .status(400)
      .json({ message: "asset_type, description, value, owner_id are required" });
  }

  const sql =
    "INSERT INTO Asset (asset_type, description, value, status, owner_id) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [asset_type, description, value, status || "Owned", owner_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ id: result.insertId, asset_type, description, value, status: status || "Owned", owner_id });
    },
  );
});

router.put("/:id", requireRole(...STAFF_ROLES), (req, res) => {
  const { asset_type, description, value, status, owner_id } = req.body;

  if (!asset_type || !description || value === undefined || !owner_id) {
    return res
      .status(400)
      .json({ message: "asset_type, description, value, owner_id are required" });
  }

  const sql =
    "UPDATE Asset SET asset_type=?, description=?, value=?, status=?, owner_id=? WHERE id=?";
  db.query(
    sql,
    [asset_type, description, value, status || "Owned", owner_id, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not Found" });
      res.json({ id: req.params.id, asset_type, description, value, status: status || "Owned", owner_id });
    },
  );
});

router.get("/", requireRole(...READ_ROLES), (req, res) => {
  db.query(`${ASSET_SELECT} ORDER BY a.id DESC`, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

router.get("/:id", requireRole(...READ_ROLES), (req, res) => {
  db.query(`${ASSET_SELECT} WHERE a.id = ?`, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Not Found" });
    res.json(results[0]);
  });
});

const customersRouter = express.Router();

customersRouter.use(verifyToken, requireRole(...READ_ROLES));

customersRouter.get("/assets", (req, res) => {
  db.query(`${ASSET_SELECT} ORDER BY u.name, a.id`, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

customersRouter.get("/:id/assets", (req, res) => {
  db.query("SELECT id, name, email FROM User WHERE id = ?", [req.params.id], (err, customerResults) => {
    if (err) return res.status(500).json({ message: err.message });
    if (customerResults.length === 0) return res.status(404).json({ message: "Customer Not Found" });

    db.query(`${ASSET_SELECT} WHERE a.owner_id = ? ORDER BY a.id DESC`, [req.params.id], (err, assets) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ customer: customerResults[0], assets });
    });
  });
});

export default router;
export { ASSET_SELECT, READ_ROLES, STAFF_ROLES, customersRouter };
