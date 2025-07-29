import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WalletActionDto {
  @IsString()
  action: 'bet' | 'win';

  @IsNumber()
  amount: number;

  @IsString()
  action_id: string;
}

export class WalletPlayDto {
  @IsString()
  user_id: string;

  @IsString()
  currency: string;

  @IsString()
  game: string;

  @IsString()
  game_id: string;

  @IsBoolean()
  @IsOptional()
  finished?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WalletActionDto)
  actions: WalletActionDto[];
}

export class WalletTransactionDto {
  @IsString()
  action_id: string;

  @IsString()
  @IsOptional()
  tx_id?: string;

  @IsString()
  @IsOptional()
  processed_at?: string;
}

export class WalletPlayResponseDto {
  @IsNumber()
  balance: number;

  @IsString()
  game_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WalletTransactionDto)
  transactions: WalletTransactionDto[];
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