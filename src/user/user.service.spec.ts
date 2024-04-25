import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { validate } from 'class-validator';
import { Prisma, Role, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ConflictException } from '@nestjs/common';
import { Pagination } from '../common/pagination';
import { ResponseProfileDto } from './dtos/response-user.dto';
import { DefaultArgs } from '@prisma/client/runtime/library';

const mockUser: User = {
  uuid: '1234',
  name: 'John Doe',
  email: 'test@example.com',
  username: 'testuser',
  password: 'StrongPassword123',
  phone: '+359123456789',
  date_of_birth: new Date('1990-01-01'),
  role: Role.USER,
  profile_pic: null,
  header_pic: null,
  bio: null,
  verified_email: false,
  verified_phone: false,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  chatUuid: null,
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    userService = moduleRef.get(UserService);
    prismaService = moduleRef.get(PrismaService);
  });

  describe('CreateUserDto', () => {
    let dto: CreateUserDto;

    beforeEach(() => {
      dto = new CreateUserDto();
    });

    it('should validate a valid CreateUserDto object', async () => {
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'StrongPassword123..!!';
      dto.name = 'John Doe';
      dto.phone = '+359888888888';
      dto.date_of_birth = '1990-01-01';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation if email is not provided', async () => {
      dto.username = 'testuser';
      dto.password = 'StrongPassword123..!!';
      dto.name = 'John Doe';
      dto.phone = '+359888888888';
      dto.date_of_birth = '1990-01-01';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isEmail',
        'email must be an email',
      );
    });

    it('should fail validation if email is not an email', async () => {
      dto.email = 'blabla';
      dto.username = 'testuser';
      dto.password = 'StrongPassword123..!!';
      dto.name = 'John Doe';
      dto.phone = '+359888888888';
      dto.date_of_birth = '1990-01-01';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isEmail',
        'email must be an email',
      );
    });

    // Add more tests for other validation rules
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      prismaService.user.findMany.mockResolvedValue([]);
      prismaService.user.create.mockResolvedValue(mockUser);

      const createdUser = await userService.createUser(
        plainToInstance(CreateUserDto, mockUser),
      );

      expect(createdUser).toEqual(mockUser);
    });

    it('should throw ConflictException if email is already in use', async () => {
      const existingUser: User = {
        uuid: '1234',
        name: 'John Doe',
        email: 'test@example.com',
        username: 'testuser',
        password: 'StrongPassword123',
        phone: '+359123456789',
        date_of_birth: new Date('1990-01-01'),
        role: 'USER',
        profile_pic: null,
        header_pic: null,
        bio: null,
        verified_email: false,
        verified_phone: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        chatUuid: null,
      };

      prismaService.user.findMany.mockResolvedValue([existingUser]);

      await expect(
        userService.createUser(plainToInstance(CreateUserDto, existingUser)),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return a list of users with pagination data', async () => {
      const pagination: Pagination = {
        page: 1,
        limit: 10,
      };
      const users = [
        mockUser,
        {
          ...mockUser,
          uuid: '5678',
        },
      ];
      const totalCount = users.length;

      prismaService.user.count.mockResolvedValue(totalCount);
      prismaService.user.findMany.mockResolvedValue(users);

      const result = await userService.findAll(pagination);

      expect(result).toEqual(
        expect.objectContaining({
          data: plainToInstance(ResponseProfileDto, users),
          totalCount,
          ...pagination,
        }),
      );
    });
    it('should return an empty list if no users are in the db', async () => {
      const pagination: Pagination = {
        page: 1,
        limit: 10,
      };

      prismaService.user.count.mockResolvedValue(0);
      prismaService.user.findMany.mockResolvedValue([]);

      const result = await userService.findAll(pagination);

      expect(result).toEqual(
        expect.objectContaining({
          data: [],
          totalCount: 0,
          ...pagination,
        }),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user if found by email', async () => {
      const email = 'test@example.com';

      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findByEmail(email);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by email', async () => {
      const email = 'nonexistent@example.com';

      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await userService.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return user if found by username', async () => {
      const username = 'testuser';

      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findByUsername(username);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by username', async () => {
      const username = 'nonexistent';

      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await userService.findByUsername(username);

      expect(result).toBeNull();
    });
  });

  describe('findByPhone', () => {
    const phone = '+359123456789';

    it('should return user if found by phone', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findByPhone(phone);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by phone', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await userService.findByPhone(phone);

      expect(result).toBeNull();
    });
  });

  describe('findByUUID', () => {
    const uuid = '1234';

    it('should return user if found by UUID', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findByUUID(uuid);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by UUID', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await userService.findByUUID(uuid);

      expect(result).toBeNull();
    });
  });

  describe('getUserRating', () => {
    it('should return 0 if uuid is not provided', async () => {
      const rating = await userService.getUserRating(undefined);

      expect(rating).toBe(0);
    });

    it('should return average rating when user has ratings', async () => {
      const uuid = '123';
      const userRatingMock = [
        {
          user_rated_uuid: '123',
          _avg: { rating: 4.5 },
          _count: 2,
        },
      ];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      prismaService.userRating.groupBy.mockReturnValueOnce(userRatingMock);

      const rating = await userService.getUserRating(uuid);

      expect(rating).toBe(4.5);
    });

    it('should return 0 when user has no ratings', async () => {
      const uuid = '123';
      const userRatingMock:
        | (Prisma.PickEnumerable<
            Prisma.UserRatingGroupByOutputType,
            | Prisma.UserRatingScalarFieldEnum
            | Prisma.UserRatingScalarFieldEnum[]
          > & {
            _count:
              | true
              | {
                  uuid?: number | undefined;
                  rating?: number | undefined;
                  user_rated_uuid?: number | undefined;
                  created_at?: number | undefined;
                  deleted_at?: number | undefined;
                  user_uuid?: number | undefined;
                  _all?: number | undefined;
                }
              | undefined;
            _min:
              | {
                  uuid?: string | null | undefined;
                  rating?: number | null | undefined;
                  user_rated_uuid?: string | null | undefined;
                  created_at?: Date | null | undefined;
                  deleted_at?: Date | null | undefined;
                  user_uuid?: string | null | undefined;
                }
              | undefined;
            _max:
              | {
                  uuid?: string | null | undefined;
                  rating?: number | null | undefined;
                  user_rated_uuid?: string | null | undefined;
                  created_at?: Date | null | undefined;
                  deleted_at?: Date | null | undefined;
                  user_uuid?: string | null | undefined;
                }
              | undefined;
            _avg: { rating?: number | null | undefined } | undefined;
            _sum: { rating?: number | null | undefined } | undefined;
          })[]
        | Prisma.GetUserRatingGroupByPayload<
            Prisma.UserRatingGroupByArgs<DefaultArgs>
          > = [];

      prismaService.userRating.groupBy.mockResolvedValue(userRatingMock);

      const rating = await userService.getUserRating(uuid);

      expect(rating).toBe(0);
    });
  });
});
