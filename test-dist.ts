import fs from 'fs';
import path from 'path';

let distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))) {
  distPath = path.join(process.cwd(), 'dist');
} else if (fs.existsSync(path.join(process.cwd(), 'index.html'))) {
  distPath = process.cwd();
}
console.log(distPath);
