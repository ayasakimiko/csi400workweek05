import express from "express";
import db from "../database/sqlconnect.js";
import { verifyToken, requireRole, READ_ROLES } from "../middleware/Authservice.js";

const router = express.Router();
const promiseDb = db.promise();

const REPORT_ROLES = READ_ROLES.filter((role) => role !== "staff");
const SUMMARY_ROLES = REPORT_ROLES.filter((role) => role !== "partner_client");
const OWNERSHIP_ROLES = READ_ROLES;

router.use(verifyToken);

router.get("/assets/summary", requireRole(...SUMMARY_ROLES), async (req, res) => {
  try {
    const [[{ totalAssets }]] = await promiseDb.query(
      "SELECT COUNT(*) AS totalAssets FROM Asset",
    );
    const [[{ totalOwners }]] = await promiseDb.query(
      "SELECT COUNT(DISTINCT owner_id) AS totalOwners FROM Asset",
    );
    const [byType] = await promiseDb.query(
      "SELECT asset_type, COUNT(*) AS count FROM Asset GROUP BY asset_type",
    );
    const [[{ totalValue }]] = await promiseDb.query(
      "SELECT COALESCE(SUM(value), 0) AS totalValue FROM Asset",
    );
    const [byStatus] = await promiseDb.query(
      "SELECT status, COUNT(*) AS count FROM Asset GROUP BY status",
    );

    res.json({
      totalAssets,
      totalOwners,
      assetsByType: byType,
      totalValue,
      ownershipByStatus: byStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/assets/high-value", requireRole(...READ_ROLES), async (req, res) => {
  const minValue = Number(req.query.minValue);

  if (req.query.minValue === undefined || Number.isNaN(minValue)) {
    return res.status(400).json({ message: "minValue is required and must be a number" });
  }

  try {
    const [rows] = await promiseDb.query(
      `SELECT a.asset_type, a.description, a.value, a.status,
              u.id AS owner_id, u.name AS owner_name, u.email AS owner_email
       FROM Asset a
       JOIN User u ON u.id = a.owner_id
       WHERE a.value > ?
       ORDER BY a.value DESC`,
      [minValue],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/ownership", requireRole(...OWNERSHIP_ROLES), async (req, res) => {
  const { assetType } = req.query;

  if (!assetType) {
    return res.status(400).json({ message: "assetType is required" });
  }

  try {
    const [rows] = await promiseDb.query(
      `SELECT u.id AS owner_id, u.name AS owner_name, u.email AS owner_email,
              a.id AS asset_id, a.description, a.value, a.status
       FROM Asset a
       JOIN User u ON u.id = a.owner_id
       WHERE a.asset_type = ?
       ORDER BY u.name`,
      [assetType],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
