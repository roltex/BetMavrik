import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Get()
  getHello(): { message: string; version: string; timestamp: string } {
    this.logger.log('Root endpoint accessed');
    return {
      message: '🎰 BetMavrik Casino API is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string; uptime: number } {
    this.logger.log('Health check requested');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
} 