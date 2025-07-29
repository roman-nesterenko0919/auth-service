import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DrizzleService } from '../drizzle.service';

describe('UserService', () => {
  let service: UserService;
  let findFirstMock: jest.Mock;
  let insertMock: jest.Mock;

  beforeEach(async () => {
    findFirstMock = jest.fn();
    insertMock = jest.fn();
    const redisGetMock = jest.fn();
    const redisSetMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DrizzleService,
          useValue: {
            db: {
              query: {
                users: {
                  findFirst: findFirstMock,
                }
              },
              insert: jest.fn(() => ({
                values: jest.fn(() => ({
                  returning: insertMock,
                })),
              })),
            },
          },
        },
        {
          provide: 'REDIS',
          useValue: {
            get: redisGetMock,
            set: redisSetMock,
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user by id', async () => {
    const user = { id: 1, email: 'test@example.com' };
    findFirstMock.mockResolvedValue(user);

    const result = await service.getById(1);

    expect(findFirstMock).toHaveBeenCalled();
    expect(result).toEqual(user);
  })

  it('should return user by email', async () => {
    const user = { id: 1, email: 'test@example.com' };
    findFirstMock.mockResolvedValue(user);

    const result = await service.getByEmail('test@example.com');

    expect(findFirstMock).toHaveBeenCalled();
    expect(result).toEqual(user);
  })

  it('should return profile by id', async () => {
    const userFromDb = {
      id: 1,
      email: 'user@example.com',
      username: 'John',
      password: 'hashedpassword',
      fullname: 'Jonh Sand',
      dateBirth: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    findFirstMock.mockResolvedValue(userFromDb);

    const result = await service.getProfile(1);

    expect(findFirstMock).toHaveBeenCalled();

    expect(result).toEqual({
      user: {
        id: 1,
        email: 'user@example.com',
        username: 'John',
        fullname: 'Jonh Sand',
        dateBirth: null,
      },
    });
  })

  it('should create a new user', async () => {
    const dto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'pass',
      fullname: 'New User',
      birthDate: '2000-01-11',
    };
    const createdUser = {
      id: 3,
      username: dto.username,
      email: dto.email,
      fullname: dto.fullname,
      birthDate: dto.birthDate,
    };

    insertMock.mockResolvedValue([createdUser]);

    const result = await service.create(dto);

    expect(insertMock).toHaveBeenCalled();
    expect(result).toEqual(createdUser);
  });
});

