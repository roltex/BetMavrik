import { Controller, Post, Body, Get, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { BalanceService } from '../services/balance.service';
import { HmacGuard } from '../../common/guards/hmac.guard';
import { CasinoWebSocketGateway } from '../../websocket/websocket.gateway'; 
import { 
  WalletPlayDto, 
  WalletPlayResponseDto, 
  WalletRollbackDto, 
  TransactionDto,
  WalletTransactionDto 
} from '../../common/dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly webSocketGateway: CasinoWebSocketGateway,
  ) {}

  @Post('play')
  @UseGuards(HmacGuard)
  async handlePlay(@Body() playDto: WalletPlayDto): Promise<WalletPlayResponseDto> {
    try {
      console.log('💰 All-InGame wallet play request:', JSON.stringify(playDto, null, 2));
      
      const transactions: WalletTransactionDto[] = [];
      let currentBalance = await this.balanceService.getBalance(playDto.user_id);
      
      // Process each action in order
      for (const action of playDto.actions) {
        console.log(`⚡ Processing action: ${action.action} - ${action.amount} (ID: ${action.action_id})`);
        
        if (action.action === 'bet') {
          // Process bet (deduct from balance)
          const result = await this.balanceService.processBet(
            playDto.user_id,
            action.amount,
            playDto.game_id,
            action.action_id
          );
          currentBalance = result.balance;
          
        } else if (action.action === 'win') {
          // Process win (add to balance)
          const result = await this.balanceService.processWin(
            playDto.user_id,
            action.amount,
            playDto.game_id,
            action.action_id
          );
          currentBalance = result.balance;
        }
        
        // Add transaction response
        transactions.push({
          action_id: action.action_id,
          tx_id: `${action.action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          processed_at: new Date().toISOString()
        });
      }

      const response: WalletPlayResponseDto = {
        balance: Math.round(currentBalance * 100), // Convert to subunits (cents)
        game_id: playDto.game_id,
        transactions: transactions
      };

      console.log('✅ All-InGame wallet operation successful:', response);

      // Notify all connected clients about balance change
      this.webSocketGateway.notifyBalanceChange(playDto.user_id, currentBalance);

      return response;
    } catch (error) {
      console.error('❌ All-InGame wallet operation failed:', error);
      
      // Return 412 for insufficient balance as per specification
      if (error.message?.includes('Insufficient balance')) {
        throw new HttpException('Insufficient balance', HttpStatus.PRECONDITION_FAILED);
      }
      
      throw new HttpException(
        error.message || 'Failed to process wallet operation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('play-debug')
  async handlePlayDebug(@Body() playDto: WalletPlayDto) {
    try {
      console.log('🧪 DEBUG: All-InGame wallet play request without HMAC:', JSON.stringify(playDto, null, 2));
      
      const transactions: WalletTransactionDto[] = [];
      let currentBalance = await this.balanceService.getBalance(playDto.user_id);
      
      // Process each action in order
      for (const action of playDto.actions) {
        console.log(`⚡ DEBUG: Processing action: ${action.action} - ${action.amount} (ID: ${action.action_id})`);
        
        if (action.action === 'bet') {
          const result = await this.balanceService.processBet(
            playDto.user_id,
            action.amount,
            playDto.game_id,
            action.action_id
          );
          currentBalance = result.balance;
          
        } else if (action.action === 'win') {
          const result = await this.balanceService.processWin(
            playDto.user_id,
            action.amount,
            playDto.game_id,
            action.action_id
          );
          currentBalance = result.balance;
        }
        
        transactions.push({
          action_id: action.action_id,
          tx_id: `${action.action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          processed_at: new Date().toISOString()
        });
      }

      const response: WalletPlayResponseDto = {
        balance: Math.round(currentBalance * 100), // Convert to subunits (cents)
        game_id: playDto.game_id,
        transactions: transactions
      };

      console.log('✅ DEBUG: All-InGame operation successful:', response);
      this.webSocketGateway.notifyBalanceChange(playDto.user_id, currentBalance);

      return response;
    } catch (error) {
      console.error('❌ DEBUG: All-InGame operation failed:', error);
      return {
        error: {
          code: -1,
          description: `Error: ${error.message}`
        }
      };
    }
  }

  @Post('rollback')
  @UseGuards(HmacGuard)
  async handleRollback(@Body() rollbackDto: WalletRollbackDto) {
    try {
      console.log('↩️ Wallet rollback request:', rollbackDto);
      
      const result = await this.balanceService.processRollback(
        rollbackDto.user_id,
        rollbackDto.transaction_id,
        // gameId is optional, and rollbackDto doesn't have game_id field
      );

      console.log('✅ Rollback operation successful:', result);

      // Notify all connected clients about balance change
      this.webSocketGateway.notifyBalanceChange(result.user_id, result.balance);

      return result;
    } catch (error) {
      console.error('❌ Rollback operation failed:', error);
      throw new HttpException(
        error.message || 'Failed to process rollback',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('test-balance/:userId')
  async testBalance(@Param('userId') userId: string) {
    try {
      console.log(`🧪 Testing balance operations for user: ${userId}`);
      
      // Get current balance
      const currentBalance = await this.balanceService.getBalance(userId);
      console.log(`💰 Current balance: ${currentBalance}`);
      
      // Test bet operation
      const betResult = await this.balanceService.processBet(userId, 10, 'test-game');
      console.log(`🎲 After bet: ${betResult.balance}`);
      
      // Test win operation
      const winResult = await this.balanceService.processWin(userId, 5, 'test-game');
      console.log(`🎉 After win: ${winResult.balance}`);
      
      return {
        success: true,
        operations: {
          initial: currentBalance,
          afterBet: betResult.balance,
          afterWin: winResult.balance
        }
      };
    } catch (error) {
      console.error('❌ Test balance failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('transactions/:userId')
  async getTransactions(@Param('userId') userId: string): Promise<TransactionDto[]> {
    return await this.balanceService.getTransactions(userId);
  }
} 