import { Controller, Post, Body, Get, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { BalanceService } from '../services/balance.service';
import { WalletPlayDto, WalletRollbackDto, TransactionDto } from '../../common/dto/wallet.dto';
import { CasinoWebSocketGateway } from '../../websocket/websocket.gateway';
import { HmacGuard } from '../../common/guards/hmac.guard';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly webSocketGateway: CasinoWebSocketGateway,
  ) {}

  @Post('play')
  @UseGuards(HmacGuard)
  async handlePlay(@Body() playDto: WalletPlayDto) {
    try {
      console.log('💰 Wallet play request:', playDto);
      
      let result: { user_id: string; balance: number };
      
      if (playDto.amount < 0) {
        // This is a bet (negative amount)
        console.log(`🎲 Processing bet: ${Math.abs(playDto.amount)} for user ${playDto.user_id}`);
        result = await this.balanceService.processBet(
          playDto.user_id,
          Math.abs(playDto.amount),
          playDto.game_id,
        );
      } else {
        // This is a win (positive amount)
        console.log(`🎉 Processing win: ${playDto.amount} for user ${playDto.user_id}`);
        result = await this.balanceService.processWin(
          playDto.user_id,
          playDto.amount,
          playDto.game_id,
        );
      }

      console.log('✅ Wallet operation successful:', result);

      // Notify all connected clients about balance change
      this.webSocketGateway.notifyBalanceChange(result.user_id, result.balance);

      return result;
    } catch (error) {
      console.error('❌ Wallet operation failed:', error);
      throw new HttpException(
        error.message || 'Failed to process wallet operation',
        HttpStatus.BAD_REQUEST,
      );
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

  @Post('play-debug')
  async handlePlayDebug(@Body() playDto: WalletPlayDto) {
    try {
      console.log('🧪 DEBUG: Wallet play request without HMAC guard:', playDto);
      console.log('🧪 DEBUG: Request user_id type:', typeof playDto.user_id);
      console.log('🧪 DEBUG: Request amount type:', typeof playDto.amount);
      
      let result: { user_id: string; balance: number };
      
      if (playDto.amount < 0) {
        // This is a bet (negative amount)
        console.log(`🎲 DEBUG: Processing bet: ${Math.abs(playDto.amount)} for user ${playDto.user_id}`);
        result = await this.balanceService.processBet(
          playDto.user_id,
          Math.abs(playDto.amount),
          playDto.game_id,
        );
      } else {
        // This is a win (positive amount)
        console.log(`🎉 DEBUG: Processing win: ${playDto.amount} for user ${playDto.user_id}`);
        result = await this.balanceService.processWin(
          playDto.user_id,
          playDto.amount,
          playDto.game_id,
        );
      }

      console.log('✅ DEBUG: Wallet operation successful:', result);

      // Notify all connected clients about balance change
      this.webSocketGateway.notifyBalanceChange(result.user_id, result.balance);

      return result;
    } catch (error) {
      console.error('❌ DEBUG: Wallet operation failed:', error);
      return {
        error: {
          code: -1,
          description: `Error: ${error.message}`
        }
      };
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
    try {
      return await this.balanceService.getTransactions(userId);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch transactions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 