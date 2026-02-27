import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  const { dir } = req.query;
  
  if (!dir) {
    return res.status(400).json({ error: 'Missing dir parameter' });
  }
  
  try {
    const dirPath = path.join(__dirname, '..', dir);
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    
    res.status(200).json(files);
  } catch (error) {
    console.error('Error:', error);
    res.status(404).json({ error: 'Directory not found' });
  }
}
