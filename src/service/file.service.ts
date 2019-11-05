const fs = require('fs');

class FileService {

  public read(path: string): any {
    if (this.exists(path)) {
      return fs.readFileSync(path, 'utf8');
    }
    throw new Error(`not found: ${path}`);
  }

  public readAll(path: string): any[] {
    if (this.exists(path)) {
      return fs.readdirSync(path).filter((file: string) => {
        return fs.lstatSync(`${path}/${file}`).isFile();
      }).map((file: string) => {
        return this.read(`${path}/${file}`);
      });
    }
    throw new Error(`not found: ${path}`);
  }

  public exists(path: string): boolean {
    return fs.existsSync(path);
  }

}

export const fileService = new FileService();
