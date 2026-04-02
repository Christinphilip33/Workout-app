import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'data', 'exercises.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/isCustom: false,/g, 'globalFormCues: "Maintain core tension and control the eccentric phase.",\n    isCustom: false,');

fs.writeFileSync(filePath, content);
console.log('Successfully updated exercises schema with globalFormCues.');
