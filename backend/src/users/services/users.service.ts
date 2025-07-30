import { Injectable } from '@nestjs/common';
import { BalanceService } from '../../wallet/services/balance.service';
import { UserDto, CreateUserDto } from '../../common/dto/user.dto';

@Injectable()
export class UsersService {
  private users: Map<string, UserDto> = new Map();
  private currentUserId: string;

  constructor(private readonly balanceService: BalanceService) {
    // Initialize with a default user for testing
    this.createUser({
      username: 'Roland',
      email: 'roland@betmavrik.com',
      firstname: 'Roland',
      lastname: 'Esakia',
      country: 'Geo',
      city: 'Tbilisi',
      date_of_birth: '1988-10-17',
      registered_at: '2024-01-01',
      gender: 'm'
    }).then(user => {
      this.currentUserId = user.id;
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const balance = await this.balanceService.getBalance(userId);
    
    const user: UserDto = {
      id: userId,
      username: createUserDto.username,
      email: createUserDto.email,
      balance,
      firstname: createUserDto.firstname || 'Demo',
      lastname: createUserDto.lastname || 'User',
      country: createUserDto.country || 'US',
      city: createUserDto.city || 'New York',
      date_of_birth: createUserDto.date_of_birth || '1990-01-01',
      registered_at: createUserDto.registered_at || '2024-01-01',
      gender: createUserDto.gender || 'm'
    };
    
    this.users.set(userId, user);
    return user;
  }

  async getCurrentUser(): Promise<UserDto> {
    try {
      console.log('👤 getCurrentUser called');
      console.log('   Current user ID:', this.currentUserId);
      
      if (!this.currentUserId) {
        console.log('⚠️ No current user, creating default user...');
        // If no current user, create one
        const user = await this.createUser({
          username: 'demo_user',
          email: 'demo@betmavrik.com',
          firstname: 'Demo',
          lastname: 'User',
          country: 'US',
          city: 'New York',
          date_of_birth: '1990-01-01',
          registered_at: '2024-01-01',
          gender: 'm'
        });
        console.log('✅ Default user created:', user);
        this.currentUserId = user.id;
        return user;
      }
      
      console.log('📖 Getting existing user...');
      const user = await this.getUser(this.currentUserId);
      console.log('✅ Existing user retrieved:', user);
      return user;
    } catch (error) {
      console.error('❌ Error in getCurrentUser:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<UserDto | null> {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }
    
    // Get fresh balance from Redis
    const balance = await this.balanceService.getBalance(userId);
    const updatedUser = { ...user, balance };
    
    // Update the user with fresh balance
    this.users.set(userId, updatedUser);
    
    return updatedUser;
  }

  async getOrCreateUser(userId: string): Promise<UserDto> {
    let user = await this.getUser(userId);
    
    if (!user) {
      user = await this.createUser({
        username: `user_${userId}`,
      });
    }
    
    return user;
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users: UserDto[] = [];
    
    for (const [userId] of this.users) {
      const user = await this.getUser(userId);
      if (user) {
        users.push(user);
      }
    }
    
    return users;
  }
} 