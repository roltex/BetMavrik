import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller';
import { BalanceService } from './services/balance.service';
import { RedisService } from '../common/services/redis.service';
import { CasinoWebSocketGateway } from '../websocket/websocket.gateway';
import { HmacGuard } from '../common/guards/hmac.guard';
import { HmacService } from '../common/services/hmac.service';

@Module({
  controllers: [WalletController],
  providers: [BalanceService, RedisService, CasinoWebSocketGateway, HmacGuard, HmacService],
  exports: [BalanceService],
})
export class WalletModule {} 