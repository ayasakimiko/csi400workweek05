import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import mongoRouter from './router/routermongo.js';
import sqlUserRouter from './router/routersqltest.js';
import loginRouter from './router/routerlogin.js';
import publicRouter from './router/routerPublic.js';
import adminRouter from './router/routerAdmin.js';
import assetsRouter, { customersRouter } from './router/routerAssets.js';
import reportsRouter from './router/routerReports.js';

const app = express();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27018/ProductData')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5500')
  .split(',')
  .map((origin) => origin.trim());

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin '${origin}' is not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/sql', sqlUserRouter);
app.use('/api/auth', loginRouter);
app.use('/api/public', publicRouter);
app.use('/api/admin', adminRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api', mongoRouter);

app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => console.log('Server running on http://localhost:3000'));