import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceSelect } from './selects/service.select';
import { ResponseServiceDto } from './dto/response-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createServiceDto: CreateServiceDto,
  ): Promise<ResponseServiceDto> {
    return this.prismaService.service.create({
      data: createServiceDto,
      select: ServiceSelect,
    });
  }

  async findAll(): Promise<ResponseServiceDto[]> {
    return this.prismaService.service.findMany({
      select: ServiceSelect,
      where: {
        status: 'PUBLIC',
        deleted_at: null,
      },
    });
  }

  async update(
    uuid: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ResponseServiceDto> {
    return this.prismaService.service.update({
      where: {
        uuid,
      },
      data: updateServiceDto,
      select: ServiceSelect,
    });
  }

  async remove(uuid: string) {
    return this.prismaService.service.update({
      where: {
        uuid,
      },
      data: {
        status: 'DELETED',
        deleted_at: new Date(),
      },
    });
  }
}
