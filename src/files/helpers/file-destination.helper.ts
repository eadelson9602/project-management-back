import { Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

export const fileDestination = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, destination: string) => void,
) => {
  const folder = req.params.folder;
  if (!folder) {
    return cb(new Error('No se especificó la carpeta de destino'), '');
  }
  // Usar process.cwd() para rutas relativas al root del proyecto NestJS
  const uploadPath = path.join(process.cwd(), 'static', folder);
  fs.mkdirSync(uploadPath, { recursive: true });
  cb(null, uploadPath);
};
