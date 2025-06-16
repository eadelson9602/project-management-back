import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { DiskStorageOptions } from 'multer';

export const fileNamer: DiskStorageOptions['filename'] = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

  if (!fileExtension) {
    return callback(new Error('File must have an extension'), '');
  }

  const fileName = `${uuid()}.${fileExtension}`;
  callback(null, fileName);
};
