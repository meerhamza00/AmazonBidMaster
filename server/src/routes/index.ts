import { Express } from 'express';
import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import express from 'express';

// Import route modules
import campaignRoutes from './campaign.routes';
import ruleRoutes from './rule.routes';
import recommendationRoutes from './recommendation.routes';
import chatRoutes from './chat.routes';
import uploadRoutes from './upload.routes';

export function setupRoutes(app: Express): Server {
  // API routes
  app.use('/api/campaigns', campaignRoutes);
  app.use('/api/rules', ruleRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/upload-csv', uploadRoutes);

  // Serve static files from client assets directory
  app.use('/src/assets', express.static(path.join(process.cwd(), 'client/src/assets')));

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSocket server
  setupWebSocketServer(httpServer);
  
  return httpServer;
}

function setupWebSocketServer(httpServer: Server): void {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    
    // Send welcome message
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ 
        type: 'info', 
        message: 'Connected to Amazon PPC Optimizer WebSocket server' 
      }));
    }
  });
}