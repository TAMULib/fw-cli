const fs = require('fs');

import { config } from '../config';

class FileService {

  public read(path: string): any {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path, 'utf8');
    }
    throw new Error(`not found: ${path}`);
  }

  public readAll(path: string): any[] {
    if (fs.existsSync(path)) {
      return fs.readdirSync(path).map((file: string) => {
        return this.read(`${path}/${file}`);
      });
    }
    throw new Error(`not found: ${path}`);
  }

}

export const fileService = new FileService();
