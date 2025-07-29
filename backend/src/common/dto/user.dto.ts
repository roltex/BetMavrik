import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsNumber()
  balance: number;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  date_of_birth?: string;

  @IsString()
  @IsOptional()
  registred_at?: string;

  @IsString()
  @IsIn(['m', 'f'])
  @IsOptional()
  gender?: string;
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  date_of_birth?: string;

  @IsString()
  @IsOptional()
  registred_at?: string;

  @IsString()
  @IsIn(['m', 'f'])
  @IsOptional()
  gender?: string;
} 