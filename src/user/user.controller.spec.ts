import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getProfile: jest.fn().mockResolvedValue([
              {
                id: 2,
                username: 'testuser',
                email: 'test@example.com',
                fullname: 'Test User',
              },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a profile of user', async () => {
    expect(await controller.profile(2)).toEqual([
      {
        id: 2,
        username: 'testuser',
        email: 'test@example.com',
        fullname: 'Test User',
      },
    ])
  });

});
