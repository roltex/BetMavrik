import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto, CreateUserDto } from '../../common/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(): Promise<UserDto> {
    // For demo purposes, return the first user
    const users = await this.usersService.getAllUsers();
    if (users.length === 0) {
      // Create a demo user if none exists
      return await this.usersService.createUser({
        username: 'demo_user',
        email: 'demo@betmavrik.com',
      });
    }
    return users[0];
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDto | null> {
    return await this.usersService.getUser(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.usersService.createUser(createUserDto);
  }
} 