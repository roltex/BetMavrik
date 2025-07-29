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