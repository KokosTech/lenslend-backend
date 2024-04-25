import { PrismaClient, Status } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TagService } from './tag.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { ResponseTagDto } from './dto/response-tag.dto';

describe('TagService', () => {
  let tagService: TagService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TagService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    tagService = moduleRef.get(TagService);
    prismaService = moduleRef.get(PrismaService);
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const mockedTag = {
        uuid: '1234',
        name: 'tag',
        status: Status.PUBLIC,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prismaService.tag.create.mockResolvedValue(mockedTag);

      const createTag = () =>
        tagService.createOrFind({
          name: 'tag',
        });

      // Assert
      await expect(createTag()).resolves.toStrictEqual(
        plainToInstance(ResponseTagDto, mockedTag),
      );
    });
  });
});
