import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/services/redis.service';
import { BalanceDto, TransactionDto } from '../../common/dto/wallet.dto';

@Injectable()
export class BalanceService {
  constructor(private readonly redisService: RedisService) {}

  async getBalance(userId: string): Promise<number> {
    try {
      console.log(`💰 Getting balance for user: ${userId}`);
      
      if (!this.redisService.getClient()) {
        console.warn('⚠️ Redis not available, using default balance');
        return 1000; // Default balance when Redis is not available
      }
      
      const balance = await this.redisService.get(`user:balance:${userId}`);
      const userBalance = balance ? parseFloat(balance) : 1000;
      
      console.log(`💰 User ${userId} balance: ${userBalance}`);
      return userBalance;
    } catch (error) {
      console.error(`❌ Error getting balance for user ${userId}:`, error);
      return 1000; // Default balance on error
    }
  }

  async updateBalance(userId: string, amount: number): Promise<number> {
    try {
      console.log(`💰 Updating balance for user ${userId}: ${amount > 0 ? '+' : ''}${amount}`);
      
      const currentBalance = await this.getBalance(userId);
      const newBalance = currentBalance + amount;
      
      console.log(`💰 Balance calculation: ${currentBalance} + ${amount} = ${newBalance}`);
      
      if (newBalance < 0) {
        console.error(`❌ Insufficient balance for user ${userId}: ${currentBalance} < ${Math.abs(amount)}`);
        throw new Error(`Insufficient balance. Current: ${currentBalance}, Required: ${Math.abs(amount)}`);
      }
      
      if (this.redisService.getClient()) {
        await this.redisService.set(`user:balance:${userId}`, newBalance.toString());
        console.log(`✅ Balance updated in Redis for user ${userId}: ${newBalance}`);
      } else {
        console.warn(`⚠️ Redis not available, balance update skipped for user ${userId}`);
      }
      
      return newBalance;
    } catch (error) {
      console.error(`❌ Error updating balance for user ${userId}:`, error);
      throw error;
    }
  }

  async addTransaction(transaction: Omit<TransactionDto, 'created_at'>): Promise<void> {
    try {
      console.log(`📝 Adding transaction:`, transaction);
      
      const transactionWithTimestamp = {
        ...transaction,
        created_at: new Date().toISOString(),
      };
      
      if (this.redisService.getClient()) {
        await this.redisService.lpush(
          `user:transactions:${transaction.user_id}`,
          JSON.stringify(transactionWithTimestamp)
        );
        console.log(`✅ Transaction logged for user ${transaction.user_id}`);
      } else {
        console.warn(`⚠️ Redis not available, transaction logging skipped`);
      }
    } catch (error) {
      console.error(`❌ Error adding transaction:`, error);
      // Don't throw here - transaction logging failure shouldn't break balance operations
    }
  }

  async getTransactions(userId: string, limit: number = 50): Promise<TransactionDto[]> {
    try {
      console.log(`📋 Getting transactions for user: ${userId}`);
      
      if (!this.redisService.getClient()) {
        console.warn('⚠️ Redis not available, returning empty transactions');
        return [];
      }
      
      const transactions = await this.redisService.lrange(`user:transactions:${userId}`, 0, limit - 1);
      const parsedTransactions = transactions.map(tx => JSON.parse(tx));
      
      console.log(`📋 Found ${parsedTransactions.length} transactions for user ${userId}`);
      return parsedTransactions;
    } catch (error) {
      console.error(`❌ Error getting transactions for user ${userId}:`, error);
      return [];
    }
  }

  async processBet(userId: string, amount: number, gameId?: string): Promise<BalanceDto> {
    try {
      console.log(`🎲 Processing bet for user ${userId}: ${amount} (game: ${gameId})`);
      
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
      
      console.log(`✅ Bet processed successfully for user ${userId}: ${newBalance}`);
      return { user_id: userId, balance: newBalance };
    } catch (error) {
      console.error(`❌ Error processing bet for user ${userId}:`, error);
      throw error;
    }
  }

  async processWin(userId: string, amount: number, gameId?: string): Promise<BalanceDto> {
    try {
      console.log(`🎉 Processing win for user ${userId}: ${amount} (game: ${gameId})`);
      
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
      
      console.log(`✅ Win processed successfully for user ${userId}: ${newBalance}`);
      return { user_id: userId, balance: newBalance };
    } catch (error) {
      console.error(`❌ Error processing win for user ${userId}:`, error);
      throw error;
    }
  }

  async processRollback(userId: string, transactionId: string, gameId?: string): Promise<BalanceDto> {
    try {
      console.log(`↩️ Processing rollback for user ${userId}: ${transactionId} (game: ${gameId})`);
      
      // Find the original transaction
      const transactions = await this.getTransactions(userId);
      const originalTransaction = transactions.find(tx => tx.id === transactionId);
      
      if (!originalTransaction) {
        console.error(`❌ Transaction not found for rollback: ${transactionId}`);
        throw new Error(`Transaction not found: ${transactionId}`);
      }
      
      // Reverse the original transaction
      const reverseAmount = -originalTransaction.amount;
      const newBalance = await this.updateBalance(userId, reverseAmount);
      
      // Log rollback transaction
      await this.addTransaction({
        id: `rollback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        amount: reverseAmount,
        type: 'rollback',
        game_id: gameId,
      });
      
      console.log(`✅ Rollback processed successfully for user ${userId}: ${newBalance}`);
      return { user_id: userId, balance: newBalance };
    } catch (error) {
      console.error(`❌ Error processing rollback for user ${userId}:`, error);
      throw error;
    }
  }
} 