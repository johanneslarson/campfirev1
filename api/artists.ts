import { VercelRequest, VercelResponse } from '@vercel/node';
import { promises as fs } from 'fs';
import path from 'path';

// Helper to read JSON file
async function readJsonFile(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Read artists data
    const artistsPath = path.join(process.cwd(), 'data', 'artists.json');
    const artists = await readJsonFile(artistsPath);

    if (!artists) {
      return res.status(500).json({ error: 'Failed to load artists data' });
    }

    // If there's an ID parameter, return specific artist
    const { id } = req.query;
    if (id && typeof id === 'string') {
      const artist = artists.find((a: any) => a.id === id);
      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      return res.status(200).json(artist);
    }

    // Otherwise return all artists
    return res.status(200).json(artists);
  } catch (error) {
    console.error('Error in artists endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 