import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  uploadFile() {
    return { message: 'File uploaded successfully' };
  }

  getStaticFiles(name: string, folder: string) {
    const filePath = path.join(process.cwd(), 'static', folder, name);

    if (!existsSync(filePath)) throw new Error('File not found');

    return { filePath };
  }
}
