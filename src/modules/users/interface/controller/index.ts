import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  HttpCode,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/Prisma';

import { AuthJwtTokenGuard } from '@/common/guards/AuthJwtToken';
import { CurrentUser } from '@/common/decorators/currentUser';

import { IncorrectCodeException } from '@/modules/codes/exceptions/IncorrectCode';
import { UserExistsException } from '@/modules/users/exceptions/UserExists';
import { UserDoesNotFoundException } from '@/modules/users/exceptions/UserDoesNotFound';

import { SignupDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  @Post('signup')
  @HttpCode(204)
  async signup(@Body() { phone, code, type, name }: SignupDto) {
    const candidate = await this.prisma.user.findUnique({
      where: {
        phone
      }
    });

    if (candidate) {
      throw new UserExistsException()
    }

    const foundCode = await this.prisma.code.findUnique({
      where: { phone }
    });

    if (!foundCode || foundCode.value !== code) {
      throw new IncorrectCodeException();
    }

    try {
      const createUserOperation = this.prisma.user.create({
        data: {
          type,
          name,
          phone
        }
      });

      const deleteCodeOperation = this.prisma.code.delete({
        where: { phone }
      });

      await this.prisma.$transaction([
        createUserOperation,
        deleteCodeOperation
      ]);
    } catch {
      throw new InternalServerErrorException()
    }
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() { phone, code }: SignInDto) {
    if (!phone || !code) {
      throw new BadRequestException()
    }

    const foundCode = await this.prisma.code.findUnique({
      where: { phone }
    })

    if (foundCode && foundCode.value !== code) {
      throw new IncorrectCodeException()
    }

    const foundUser = await this.prisma.user.findUnique({
      where: { phone }
    })

    if (!foundUser) {
      throw new UserDoesNotFoundException()
    }

    const token = this.jwtService.sign(
      {
        userId: foundUser.id,
        phone: foundUser.phone
      },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '1h'
      }
    )

    await this.prisma.code.delete({
      where: { phone }
    });

    return {
      user: {
        id: foundUser.id,
        type: foundUser.type,
        name: foundUser.name,
        phone: foundUser.phone,
        email: foundUser.email
      },
      token
    };
  }

  @Get('self')
  @UseGuards(AuthJwtTokenGuard)
  async getCurrentUser(@CurrentUser() { userId }: CurrentUser) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!foundUser) {
      throw new UnauthorizedException()
    }

    return {
      id: foundUser.id,
      type: foundUser.type,
      name: foundUser.name,
      phone: foundUser.phone,
      email: foundUser.email
    }
  }

  @Put()
  @UseGuards(AuthJwtTokenGuard)
  async updateUser(
    @Body() body: UpdateUserDto,
    @CurrentUser() { userId }: CurrentUser
  ) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!foundUser) throw new UnauthorizedException();

    try {
      return await this.prisma.user.update({
        where: {
          id: userId
        },
        data: body,
      });
    } catch {
      throw new UserDoesNotFoundException();
    }
  }
}
