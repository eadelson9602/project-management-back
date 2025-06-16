import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (!file) {
    return callback(new Error('No file uploaded!'));
  }

  // Validación segura del mimetype
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    return callback(new Error('Only image files are allowed!'));
  }

  callback(null, true);
};
