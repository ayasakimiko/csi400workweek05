import express from 'express';
import { IT, Food } from '../database/mongotest.js';
import { verifyToken, requireAccess } from '../middleware/Authservice.js';

const router = express.Router();

router.use(verifyToken, requireAccess('routermongo'));

// 1. Create
router.post('/it', async (req, res) => {
  try {
    const item = new IT(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Read - ดึงข้อมูลทั้งหมด
router.get('/it', async (req, res) => {
  try {
    const items = await IT.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Read - ดึงข้อมูลตาม id
router.get('/it/:id', async (req, res) => {
  try {
    const item = await IT.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not Found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Update - แก้ไขข้อมูล
router.put('/it/:id', async (req, res) => {
  try {
    const updatedItem = await IT.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Not Found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Delete - ลบข้อมูล
router.delete('/it/:id', async (req, res) => {
  try {
    const deletedItem = await IT.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Not Found' });
    res.json({ message: 'Deleted Successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 1. Create - เพิ่มสินค้า
router.post('/food', async (req, res) => {
  try {
    const food = new Food(req.body);
    const savedFood = await food.save();
    res.status(201).json(savedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Read - ดึงข้อมูลทั้งหมด
router.get('/food', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Read - ดึงข้อมูลตาม id
router.get('/food/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Not Found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Update - แก้ไขข้อมูล
router.put('/food/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) return res.status(404).json({ message: 'Not Found' });
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Delete - ลบสินค้า
router.delete('/food/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Not Found' });
    res.json({ message: 'Deleted Successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
