import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNumberString
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email?: string;
}
