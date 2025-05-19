import dotenv from 'dotenv';
import { createApp } from './app';
import { setupRoutes } from './routes';
import { setupVite, serveStatic } from './utils/vite';
import { log } from './utils/logger';

// Load environment variables from .env file
dotenv.config();

async function startServer() {
  try {
    // Create Express app
    const app = createApp();
    
    // Setup API routes and get HTTP server
    const server = setupRoutes(app);
    
    // Setup Vite in development or serve static files in production
    if (app.get('env') === 'development') {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    
    // Start the server
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      log(`Server running on port ${port} in ${app.get('env')} mode`);
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();