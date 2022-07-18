import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { addMinutes, differenceInSeconds, isPast, isFuture } from 'date-fns';
import { PrismaService } from '@/Prisma';

import { UserDoesNotFoundException } from '@/modules/users/exceptions/UserDoesNotFound';
import { UserExistsException } from '@/modules/users/exceptions/UserExists';
import { IncorrectCodeException } from '@/modules/codes/exceptions/IncorrectCode';
import { ExpiredCodeException } from '@/modules/codes/exceptions/ExpiredCode';
import { IncorrectPhoneException } from '@/modules/codes/exceptions/IncorrectPhone';

import { requestCodeDto } from '../dto/request-code.dto';
import { checkCodeDto } from '../dto/check-code.dto';

@Controller('codes')
export class CodesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('request_code')
  @HttpCode(204)
  async requestCode(@Body() { phone, codeType }: requestCodeDto) {
    if (!phone) throw new IncorrectPhoneException();

    const candidate = await this.prisma.user.findUnique({
      where: { phone }
    });

    if (codeType === 'auth' && !candidate) throw new UserDoesNotFoundException();

    if (candidate && codeType === 'signup') throw new UserExistsException();

    const foundCode = await this.prisma.code.findUnique({
      where: { phone }
    });

    const newCode: string = String(randomInt(1000, 9999));

    if (foundCode) {
      const diffSeconds = differenceInSeconds(Date.now(), foundCode.updatedAt)
      const seconds = 300

      if (diffSeconds < seconds) {
        throw new HttpException({
          message: 'TOO_MANY_REQUESTS',
          seconds: seconds - diffSeconds
        }, HttpStatus.TOO_MANY_REQUESTS)
      }

      // отправка смс

      await this.prisma.code.update({
        where: { phone },
        data: {
          value: newCode,
          expiresAt: addMinutes(new Date(), 15),
        }
      });
    } else {
      // отправка смс

      await this.prisma.code.create({
        data: {
          phone,
          value: newCode,
          expiresAt: addMinutes(new Date(), 15),
        }
      })
    }
  }

  @Post('check_code')
  @HttpCode(204)
  async checkCode(@Body() { phone, code }: checkCodeDto) {
    const foundCode = await this.prisma.code.findUnique({
      where: { phone }
    });

    if (!foundCode) throw new IncorrectCodeException()

    if (isPast(foundCode.expiresAt)) throw new ExpiredCodeException()

    if (foundCode.nextCheckAt && isFuture(foundCode.nextCheckAt)) {
      throw new HttpException({
        message: 'Превышен лимит проверок, попробуйте позже'
      }, HttpStatus.TOO_MANY_REQUESTS)
    }

    if (foundCode.value !== code) {
      await this.prisma.code.update({
        where: { phone },
        data: {
          attempt: {
            increment: 1
          }
        }
      });

      if (foundCode.attempt === 3) {
        await this.prisma.code.update({
          where: { phone },
          data: {
            attempt: 1,
            nextCheckAt: addMinutes(new Date(), 3)
          }
        });
      }

      throw new IncorrectCodeException()
    }
  }
}
