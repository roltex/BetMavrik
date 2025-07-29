import { IsString, IsNumber, IsOptional } from 'class-validator';

export class WalletPlayDto {
  @IsString()
  user_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsString()
  @IsOptional()
  game_id?: string;
}

export class WalletRollbackDto {
  @IsString()
  user_id: string;

  @IsString()
  transaction_id: string;

  @IsNumber()
  amount: number;
}

export class TransactionDto {
  @IsString()
  id: string;

  @IsString()
  user_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  type: 'bet' | 'win' | 'rollback';

  @IsString()
  @IsOptional()
  game_id?: string;

  @IsString()
  created_at: string;
}

export class BalanceDto {
  @IsString()
  user_id: string;

  @IsNumber()
  balance: number;
} 