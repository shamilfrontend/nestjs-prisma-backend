import { IsNumberString, IsMobilePhone, IsOptional, IsEnum } from 'class-validator';

enum CodeType {
  auth = 'auth',
  signup = 'signup'
}

export class requestCodeDto {
  @IsNumberString()
  @IsMobilePhone('ru-RU')
  readonly phone: string;

  @IsOptional()
  @IsEnum(CodeType)
  readonly codeType?: CodeType;
}
