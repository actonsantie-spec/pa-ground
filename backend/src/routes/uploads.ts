import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';

const uploadDir = join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});

const upload = multer({ storage });
const router = Router();

router.post('/profile-picture', authenticate, upload.single('file'), (req, res) => {
  // @ts-ignore
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file' });
  const url = `/uploads/${file.filename}`;
  res.json({ url, key: file.filename, size: file.size, mimeType: file.mimetype });
});

export default router;
