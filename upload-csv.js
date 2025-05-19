import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadCSV() {
  try {
    // Read the CSV file
    const filePath = path.join(__dirname, 'attached_assets', 'yourinput_file.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Upload to the API
    const response = await fetch('http://localhost:3000/api/upload-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file: fileContent }),
    });
    
    const data = await response.json();
    console.log('Upload response:', data);
  } catch (error) {
    console.error('Error uploading CSV:', error);
  }
}

uploadCSV();