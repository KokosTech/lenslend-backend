import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryType } from './types/category.type';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { ResponseExpandedCategoryDto } from './dto/response-expanded-category.dto';

@ApiTags('category')
@Controller('category/:type')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiTags('admin')
  @ApiParam({
    name: 'type',
    enum: ['LISTING', 'PLACE'],
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    type: ResponseCategoryDto,
  })
  async create(
    @Param('type') type: CategoryType,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    return this.categoryService.create(createCategoryDto, type);
  }

  @Get()
  @ApiParam({
    name: 'type',
    enum: ['LISTING', 'PLACE'],
  })
  @ApiResponse({
    status: 200,
    type: ResponseExpandedCategoryDto,
    isArray: true,
  })
  async findAll(
    @Param('type') type: CategoryType,
  ): Promise<ResponseExpandedCategoryDto[]> {
    return this.categoryService.findAll(type);
  }

  @Get(':uuid')
  @ApiParam({
    name: 'type',
    enum: ['LISTING', 'PLACE'],
  })
  @ApiParam({ name: 'uuid' })
  @ApiResponse({
    status: 200,
    type: ResponseExpandedCategoryDto,
  })
  async findOne(
    @Param('type') type: CategoryType,
    @Param('id') id: string,
  ): Promise<ResponseExpandedCategoryDto> {
    return this.categoryService.findOne(id, type);
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiTags('admin')
  @ApiParam({
    name: 'type',
    enum: ['LISTING', 'PLACE'],
  })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    type: ResponseCategoryDto,
  })
  async update(
    @Param('type') type: CategoryType,
    @Param('uuid') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    return this.categoryService.update(id, type, updateCategoryDto);
  }

  @Delete(':uuid')
  @Roles(Role.ADMIN)
  @ApiTags('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiParam({
    name: 'type',
    enum: ['LISTING', 'PLACE'],
  })
  @ApiParam({ name: 'uuid' })
  @ApiResponse({
    status: 200,
  })
  async remove(@Param('type') type: CategoryType, @Param('uuid') id: string) {
    return this.categoryService.remove(id, type);
  }
}
