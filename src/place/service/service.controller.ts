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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { ResponseServiceDto } from './dto/response-service.dto';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiTags('admin')
  @ApiBearerAuth()
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({
    status: 201,
    description: 'Create a new service',
    type: ResponseServiceDto,
  })
  async create(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ResponseServiceDto> {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all services',
    type: [ResponseServiceDto],
  })
  async findAll(): Promise<ResponseServiceDto[]> {
    return this.serviceService.findAll();
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiTags('admin')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({
    status: 200,
    description: 'Update a service',
    type: ResponseServiceDto,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ResponseServiceDto> {
    return this.serviceService.update(uuid, updateServiceDto);
  }

  @Delete(':uuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiTags('admin')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Delete a service',
  })
  async remove(@Param('uuid') uuid: string) {
    return this.serviceService.remove(uuid);
  }
}
