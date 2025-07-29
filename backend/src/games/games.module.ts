import { Module } from '@nestjs/common';
import { GamesController } from './controllers/games.controller';
import { GamesService } from './services/games.service';
import { HmacService } from '../common/services/hmac.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [GamesController],
  providers: [GamesService, HmacService],
  exports: [GamesService],
})
export class GamesModule {} 