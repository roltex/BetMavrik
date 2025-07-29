import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { RedisService } from './common/services/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GamesModule,
    UsersModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [RedisService],
  exports: [RedisService],
})
export class AppModule {} 