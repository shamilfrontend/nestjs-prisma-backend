import {
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  Length,
  IsNumberString,
  IsMobilePhone
} from 'class-validator';
import { UserType } from '@prisma/client';

export class SignupDto {
  @IsNumberString()
  @IsMobilePhone('ru-RU')
  readonly phone: string;

  @IsNumberString()
  @Length(4)
  readonly code: string;

  @IsString()
  readonly name: string;

  @IsEnum(UserType)
  readonly type: UserType;
}
