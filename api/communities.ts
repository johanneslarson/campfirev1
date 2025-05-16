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

    // Read communities data
    const communitiesPath = path.join(process.cwd(), 'data', 'communities.json');
    const communities = await readJsonFile(communitiesPath);

    if (!communities) {
      return res.status(500).json({ error: 'Failed to load communities data' });
    }

    return res.status(200).json(communities);
  } catch (error) {
    console.error('Error in communities endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 