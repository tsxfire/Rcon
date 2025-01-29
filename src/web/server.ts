import express from 'express';
import { Request, Response } from 'express';
import path from 'path';
import { healthMonitor } from '../healthMonitor';
import { broadcast } from '../websocket/server';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
app.get('/api/servers', (req: Request, res: Response) => {
  const servers = Array.from(healthMonitor.servers.values()).map(server => ({
    host: server.config.host,
    port: server.config.port,
    type: server.config.type,
    status: server.connectionStatus,
    lastActivity: server['lastActivity'] || null // Optional: Add activity tracking
  }));
  res.json(servers);
});

app.post('/api/command', async (req: Request, res: Response) => {
  const { host, command } = req.body;
  
  if (!host || !command) {
    return res.status(400).json({ error: 'Missing host or command' });
  }

  const server = healthMonitor.servers.get(host);
  if (!server) {
    return res.status(404).json({ error: 'Server not found' });
  }

  try {
    const response = await server.sendCommand(command);
    
    // Broadcast command result to WebSocket clients
    broadcast('command_result', {
      host,
      command,
      response,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, response });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      success: false,
      error: errorMessage 
    });
  }
});

// Serve frontend
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Web dashboard running on http://localhost:${port}`);
  console.log(`API endpoints:
  - GET /api/servers
  - POST /api/command { host: string, command: string }`);
});

// WebSocket integration
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  // Send initial server list
  const servers = Array.from(healthMonitor.servers.values()).map(server => ({
    ...server.config,
    status: server.connectionStatus
  }));
  ws.send(JSON.stringify({ event: 'init', data: servers }));

  // Handle incoming WebSocket messages
  ws.on('message', (message) => {
    console.log('Received WS message:', message.toString());
  });
});