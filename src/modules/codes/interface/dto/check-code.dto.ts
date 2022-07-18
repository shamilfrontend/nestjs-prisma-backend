import { Length, IsNumberString, IsMobilePhone } from 'class-validator';

export class checkCodeDto {
  @IsNumberString()
  @IsMobilePhone('ru-RU')
  readonly phone: string;

  @IsNumberString()
  @Length(4)
  readonly code: string;
}
