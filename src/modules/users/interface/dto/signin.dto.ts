import { Length, IsNumberString, IsMobilePhone } from 'class-validator';

export class SignInDto {
  @IsNumberString()
  @IsMobilePhone('ru-RU')
  readonly phone: string;

  @IsNumberString()
  @Length(4)
  readonly code: string;
}
