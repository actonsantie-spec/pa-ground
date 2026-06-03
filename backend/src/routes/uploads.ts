import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';

const uploadDir = join(process.cwd(), 'uploads');

// ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const router = Router();

// Upload route
router.post(
  '/profile-picture',
  authenticate,
  upload.single('file'),
  (req: Request, res: Response) => {
    const file = req.file as any; // FIX: avoids TS Multer typing issues

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const url = `/uploads/${file.filename}`;

    return res.json({
      url,
      key: file.filename,
      size: file.size,
      mimeType: file.mimetype,
    });
  }
);

export default router;