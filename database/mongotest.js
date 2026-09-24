//Table Create
import mongoose from 'mongoose';

const itSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  volume: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
}, { timestamps: true });

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  volume: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
}, { timestamps: true });

export const IT = mongoose.model('IT', itSchema);
export const Food = mongoose.model('Food', foodSchema);
