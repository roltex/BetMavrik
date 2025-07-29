import { IsString, IsNumber, IsOptional, IsUrl, IsBoolean, IsArray } from 'class-validator';

export class CreateGameSessionDto {
  @IsNumber()
  game_id: number;
}

export class GameDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  producer?: string;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  feature_group: string;

  @IsBoolean()
  @IsOptional()
  customised?: boolean;

  @IsArray()
  @IsString({ each: true })
  devices: string[];

  @IsArray()
  @IsString({ each: true })
  licenses: string[];

  @IsString()
  jackpot_type: string;

  @IsBoolean()
  @IsOptional()
  forbid_bonus_play?: boolean;

  @IsBoolean()
  @IsOptional()
  has_freespins?: boolean;

  @IsNumber()
  @IsOptional()
  payout?: number;

  @IsNumber()
  @IsOptional()
  hit_rate?: number;

  @IsString()
  @IsOptional()
  volatility_rating?: string;

  @IsBoolean()
  @IsOptional()
  has_jackpot?: boolean;

  @IsNumber()
  @IsOptional()
  lines?: number;

  @IsNumber()
  @IsOptional()
  ways?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  has_live?: boolean;

  @IsBoolean()
  @IsOptional()
  hd?: boolean;

  @IsBoolean()
  @IsOptional()
  accumulating?: boolean;

  @IsNumber()
  @IsOptional()
  multiplier?: number;

  @IsString()
  @IsOptional()
  released_at?: string;

  @IsString()
  @IsOptional()
  recalled_at?: string;

  @IsBoolean()
  @IsOptional()
  bonus_buy?: boolean;

  @IsOptional()
  restrictions?: any;

  // Thumbnail URLs
  @IsUrl()
  @IsOptional()
  thumbnail?: string;

  @IsUrl()
  @IsOptional()
  thumbnail_horizontal?: string;

  @IsUrl()
  @IsOptional()
  thumbnail_vertical?: string;
}

export class GameSessionDto {
  @IsString()
  url: string;

  @IsNumber()
  game_id: number;
} 