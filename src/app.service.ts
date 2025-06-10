import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

interface PackageJson {
  name: string;
  description?: string;
  author?: string;
  version: string;
  [key: string]: unknown;
}

@Injectable()
export class AppService {
  getRootInfo() {
    const packageJsonPath = join(__dirname, '..', '..', 'package.json');
    const packageJson = JSON.parse(
      readFileSync(packageJsonPath, 'utf8'),
    ) as PackageJson;

    return {
      name: packageJson.name,
      description: packageJson.description,
      author: packageJson.author,
      version: packageJson.version,
    };
  }
}
