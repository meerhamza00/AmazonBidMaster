import { Express } from 'express';
import { Server } from 'http';
import path from 'path';
import express from 'express';
import { log } from './logger';

/**
 * Setup Vite middleware for development
 */
export async function setupVite(app: Express, server: Server): Promise<void> {
  const { createServer: createViteServer } = await import('vite');
  
  try {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          server: server
        }
      },
      appType: 'custom',
      base: '/',
      configFile: path.resolve(process.cwd(), 'vite.config.ts')
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      // Skip API routes
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/ws')) {
        return next();
      }
      
      const url = req.originalUrl;

      try {
        // Read index.html
        let template = await vite.transformIndexHtml(
          url,
          await vite.ssrLoadModule(
            path.resolve(process.cwd(), 'client/index.html')
          )
        );

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } catch (error) {
    console.error('Vite server setup error:', error);
    throw error;
  }
}

/**
 * Serve static files in production
 */
export function serveStatic(app: Express): void {
  const clientDistPath = path.resolve(process.cwd(), 'dist/public');
  
  app.use(express.static(clientDistPath, { index: false }));
  
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/ws')) {
      return next();
    }
    
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}