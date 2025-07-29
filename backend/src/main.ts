import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend integration and Railway health checks
  app.enableCors({
    origin: [
      'http://localhost:3001', 
      'http://localhost:3000',
      'https://betmavrik-production.up.railway.app',
      /\.railway\.app$/,  // Allow all Railway subdomains
      /\.vercel\.app$/,   // Allow Vercel deployments
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  const port = process.env.PORT || 3000;
  // Listen on all interfaces (0.0.0.0) for Railway deployment
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 BetMavrik Backend running on port ${port}`);
  logger.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🌐 CORS enabled for Railway and Vercel domains`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}); 