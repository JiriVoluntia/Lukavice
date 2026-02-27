import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dir = req.query.dir;
  
  if (!dir) {
    return res.status(400).json({ error: 'Missing dir parameter' });
  }
  
  try {
    const dirPath = path.join(process.cwd(), dir);
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    
    res.status(200).json(files);
  } catch (error) {
    res.status(404).json({ error: 'Directory not found' });
  }
}
