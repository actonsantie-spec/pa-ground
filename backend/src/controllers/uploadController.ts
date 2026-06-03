import { Request, Response } from 'express';

export function uploadProfilePicture(req: Request, res: Response) {
  // handled by uploads route (multer) - kept for possible future logic
  res.status(200).json({});
}
