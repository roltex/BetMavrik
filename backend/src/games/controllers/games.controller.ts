import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GamesService } from '../services/games.service';
import { UsersService } from '../../users/services/users.service';
import { GameDto, CreateGameSessionDto, GameSessionDto } from '../../common/dto/game.dto';

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
      // Get current user data dynamically
      const userData = await this.usersService.getCurrentUser();
      
      return await this.gamesService.createGameSession(sessionDto, userData);
    } catch (error) {
      console.error('Failed to get user data for session creation:', error);
      throw new HttpException(
        'Failed to create game session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 