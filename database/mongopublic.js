//Table Create
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: [String], default: [] },
}, { timestamps: true });

export const Announcement = mongoose.model('Announcement', announcementSchema);
