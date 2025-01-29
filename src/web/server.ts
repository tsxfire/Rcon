import express, { Request, Response } from 'express';
import { healthMonitor } from '../healthMonitor';  // Add this import
import path from 'path';
import { addRconClient } from '../websocket/server';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// API endpoint to fetch server statuses
app.get('/api/servers', (req: Request, res: Response) => {
  const statuses = Array.from(healthMonitor.servers.values()).map(c => ({
    host: c.config.host,
    status: c.isConnected ? 'online' : 'offline'
  }));
  res.json(statuses);
});

// Start server
app.listen(3000, () => {
  console.log('Web dashboard running on http://localhost:3000');
});