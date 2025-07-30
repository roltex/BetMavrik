import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GamesService } from '../services/games.service';
import { UsersService } from '../../users/services/users.service';
import { GameDto, CreateGameSessionDto, GameSessionDto, CreateFreespinsDto, FreespinsResponseDto } from '../../common/dto/game.dto';

@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getGames(): Promise<GameDto[]> {
    return await this.gamesService.getGames();
  }

  @Post()
  async createGameSession(@Body() sessionDto: CreateGameSessionDto): Promise<GameSessionDto> {
    try {
      console.log('🎮 POST /games endpoint called');
      console.log('📥 Request body:', JSON.stringify(sessionDto, null, 2));
      
      // Get current user data dynamically
      console.log('👤 Getting current user data...');
      const userData = await this.usersService.getCurrentUser();
      console.log('✅ User data retrieved:', {
        id: userData.id,
        username: userData.username,
        hasFirstname: !!userData.firstname,
        hasLastname: !!userData.lastname,
        hasCountry: !!userData.country,
        hasCity: !!userData.city,
        hasDateOfBirth: !!userData.date_of_birth,
        hasRegisteredAt: !!userData.registered_at,
        hasGender: !!userData.gender
      });
      
      console.log('🚀 Calling games service...');
      const result = await this.gamesService.createGameSession(sessionDto, userData);
      console.log('✅ Games service succeeded:', result);
      
      return result;
    } catch (error) {
      console.error('❌ DETAILED ERROR in createGameSession:');
      console.error('   Error type:', error.constructor.name);
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
      
      if (error.response) {
        console.error('   HTTP Response Status:', error.response.status);
        console.error('   HTTP Response Data:', error.response.data);
        console.error('   HTTP Response Headers:', error.response.headers);
      }
      
      console.error('   Full error object:', error);
      console.error('Failed to get user data for session creation:', error);
      
      throw new HttpException(
        {
          message: 'Failed to create game session',
          error: error.message,
          details: error.response?.data || 'No additional details'
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('freespins')
  async createFreespins(@Body() freespinsDto: CreateFreespinsDto): Promise<FreespinsResponseDto> {
    try {
      // Get current user data dynamically
      const userData = await this.usersService.getCurrentUser();
      
      return await this.gamesService.createFreespins(freespinsDto, userData);
    } catch (error) {
      console.error('Failed to create freespins:', error);
      throw new HttpException(
        'Failed to create freespins',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('debug')
  async debugStatus() {
    try {
      console.log('🔧 Debug endpoint called');
      
      // Check user service
      const userData = await this.usersService.getCurrentUser();
      console.log('✅ User data retrieved for debug:', userData);
      
      // Check environment variables
      const envStatus = {
        GCP_URL: !!process.env.GCP_URL,
        GCP_URL_value: process.env.GCP_URL,
        KEY: !!process.env.KEY,
        PRIVATE: !!process.env.PRIVATE,
        REDIS_URL: !!process.env.REDIS_URL,
        RETURN_URL: process.env.RETURN_URL
      };
      
      return {
        status: 'DEBUG_INFO',
        user: {
          id: userData.id,
          username: userData.username,
          balance: userData.balance,
          hasAllFields: {
            firstname: !!userData.firstname,
            lastname: !!userData.lastname,
            country: !!userData.country,
            city: !!userData.city,
            date_of_birth: !!userData.date_of_birth,
            registered_at: !!userData.registered_at,
            gender: !!userData.gender
          }
        },
        environment: envStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Debug endpoint error:', error);
      return {
        status: 'ERROR',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      };
    }
  }
} 