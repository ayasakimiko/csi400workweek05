import express from 'express';
import { Announcement } from '../database/mongopublic.js';

const router = express.Router();

// 1. Create - เพิ่มประกาศ
router.post('/announcement', async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    const saved = await announcement.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Read - ดึงข้อมูลทั้งหมด (สาธารณะ ใครก็ดึงได้)
router.get('/announcement', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Read - ดึงข้อมูลตาม id (สาธารณะ ใครก็ดึงได้)
router.get('/announcement/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Not Found' });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Update - แก้ไขข้อมูล
router.put('/announcement/:id', async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not Found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Delete - ลบข้อมูล
router.delete('/announcement/:id', async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not Found' });
    res.json({ message: 'Deleted Successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
