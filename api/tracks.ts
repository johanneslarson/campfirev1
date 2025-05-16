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

    // Read tracks data
    const tracksPath = path.join(process.cwd(), 'data', 'tracks.json');
    const tracks = await readJsonFile(tracksPath);

    if (!tracks) {
      return res.status(500).json({ error: 'Failed to load tracks data' });
    }

    // If there's an artist_id parameter, filter tracks
    const { artist_id } = req.query;
    if (artist_id && typeof artist_id === 'string') {
      const artistTracks = tracks.filter((t: any) => t.artist_id === artist_id);
      return res.status(200).json(artistTracks);
    }

    // Otherwise return all tracks
    return res.status(200).json(tracks);
  } catch (error) {
    console.error('Error in tracks endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 