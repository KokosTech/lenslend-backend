import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { FileDto } from './dtos/file.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/RequestWithUser';
import { FileInterface, FileResponseDto } from './interface/file.interface';

@Controller('file')
@ApiTags('file')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('upload')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: FileResponseDto,
  })
  async uploadFile(
    @Req() req: RequestWithUser,
    @Query() query: FileDto,
  ): Promise<FileInterface> {
    return this.fileService.uploadFile(query, req.user.uuid);
  }
}
