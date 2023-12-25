import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
// @UseGuards(JwtAuthGuard)
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private prisma: PrismaService) {}

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
