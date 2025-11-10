/*
  Copyright (C) 2024-2025 Texas A&M University Libraries

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const fs = require('fs');
const process = require('node:process');

class FileService {

  public read(path: string): any {
    if (this.exists(path)) {
      return fs.readFileSync(path, 'utf8');
    }

    process.exitCode = 1;

    throw new Error(`Error: File not found: ${path}`);
  }

  public readAll(path: string, endsWith: string = ''): any[] {
    if (this.exists(path)) {
      return fs.readdirSync(path).filter((file: string) => {
        return !file.startsWith('.') && file.endsWith(endsWith) && fs.lstatSync(`${path}/${file}`).isFile();
      }).map((file: string) => {
        return this.read(`${path}/${file}`);
      });
    }

    process.exitCode = 1;

    throw new Error(`Error: File not found: ${path}`);
  }

  public listDirectories(path: string): string[] {
    if (this.exists(path)) {
      return fs.readdirSync(path).filter((file: string) => {
        return fs.lstatSync(`${path}/${file}`).isDirectory();
      });
    }

    process.exitCode = 1;

    throw new Error(`Error: Path not found: ${path}`);
  }

  public exists(path: string): boolean {
    return fs.existsSync(path);
  }

  public createDirectory(path: string): any {
    return fs.mkdirSync(path);
  }

  public createFile(path: string, data: any = ''): any {
    return fs.writeFileSync(path, this.stringify(data));
  }

  public save(path: string, data: any): any {
    return fs.writeFileSync(path, this.stringify(data));
  }

  private stringify(data: any = ''): any {
    let str = JSON.stringify(data, null, 2);

    if (!str.endsWith('\n')) str += '\n';
    return str;
  }

}

export const fileService = new FileService();
