import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/services/redis.service';
import { BalanceDto, TransactionDto } from '../../common/dto/wallet.dto';

@Injectable()
export class BalanceService {
  constructor(private readonly redisService: RedisService) {}

  async getBalance(userId: string): Promise<number> {
    const balance = await this.redisService.get(`user:balance:${userId}`);
    return balance ? parseFloat(balance) : 1000; // Default balance
  }

  async updateBalance(userId: string, amount: number): Promise<number> {
    const currentBalance = await this.getBalance(userId);
    const newBalance = currentBalance + amount;
    
    if (newBalance < 0) {
      throw new Error('Insufficient balance');
    }
    
    await this.redisService.set(`user:balance:${userId}`, newBalance.toString());
    return newBalance;
  }

  async addTransaction(transaction: Omit<TransactionDto, 'created_at'>): Promise<void> {
    const transactionWithTimestamp = {
      ...transaction,
      created_at: new Date().toISOString(),
    };
    
    await this.redisService.lpush(
      `user:transactions:${transaction.user_id}`,
      JSON.stringify(transactionWithTimestamp)
    );
  }

  async getTransactions(userId: string, limit: number = 50): Promise<TransactionDto[]> {
    const transactions = await this.redisService.lrange(`user:transactions:${userId}`, 0, limit - 1);
    return transactions.map(tx => JSON.parse(tx));
  }

  async processBet(userId: string, amount: number, gameId?: string): Promise<BalanceDto> {
    const transactionId = `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Deduct bet amount
    const newBalance = await this.updateBalance(userId, -amount);
    
    // Log transaction
    await this.addTransaction({
      id: transactionId,
      user_id: userId,
      amount: -amount,
      type: 'bet',
      game_id: gameId,
    });
    
    return { user_id: userId, balance: newBalance };
  }

  async processWin(userId: string, amount: number, gameId?: string): Promise<BalanceDto> {
    const transactionId = `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add win amount
    const newBalance = await this.updateBalance(userId, amount);
    
    // Log transaction
    await this.addTransaction({
      id: transactionId,
      user_id: userId,
      amount: amount,
      type: 'win',
      game_id: gameId,
    });
    
    return { user_id: userId, balance: newBalance };
  }

  async processRollback(userId: string, transactionId: string, amount: number): Promise<BalanceDto> {
    // Reverse the transaction
    const newBalance = await this.updateBalance(userId, amount);
    
    // Log rollback transaction
    await this.addTransaction({
      id: `rollback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      amount: amount,
      type: 'rollback',
      game_id: transactionId,
    });
    
    return { user_id: userId, balance: newBalance };
  }
} 