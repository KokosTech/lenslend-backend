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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category/:type')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiTags('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Param('type') type: 'LISTING' | 'PLACE') {
    return this.categoryService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('type') type: 'LISTING' | 'PLACE', @Param('id') id: string) {
    return this.categoryService.findOne(id, type);
  }

  @Patch(':id')
  update(
    @Param('type') type: 'LISTING' | 'PLACE',
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, type, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiTags('admin')
  remove(@Param('type') type: 'LISTING' | 'PLACE', @Param('id') id: string) {
    return this.categoryService.remove(id, type);
  }
}
