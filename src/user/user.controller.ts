import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/RequestWithUser';
import { PrismaService } from '../prisma/prisma.service';

@Controller('user')
// @UseGuards(JwtAuthGuard)
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: RequestWithUser): Promise<User> {
    return req.user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  @Post()
  async createUser(@Body() data: User): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
