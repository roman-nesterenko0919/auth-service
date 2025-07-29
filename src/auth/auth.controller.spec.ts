import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn().mockResolvedValue({
        user: { id: 1, email: "test@test.com"},
        accessToken: "access_token",
        refreshToken: 'refresh_token',
      }),
      register: jest.fn().mockResolvedValue({
        user: { id: 1, email: "test@test.com"},
        accessToken: "access_token",
        refreshToken: 'refresh_token',
      }),
      addRefreshTokenToResponse: jest.fn()
    }

    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = testingModule.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', async () => {
    const dto = { email: 'test@test.com', password: '1234567' };
    const mockResponse = { setHeader: jest.fn(), cookie: jest.fn() } as any;

    const result = await controller.login(dto, mockResponse);
    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
    expect(authServiceMock.addRefreshTokenToResponse).toHaveBeenCalledWith(mockResponse, 'refresh_token');
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
  });

  it('should register', async () => {
    const dto = { email: 'test65@test.com', password: '1234567', username: 'user65', fullname: 'User Test65' };
    const mockResponse = { setHeader: jest.fn(), cookie: jest.fn() } as any;

    const result = await controller.register(dto, mockResponse);
    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
    expect(authServiceMock.addRefreshTokenToResponse).toHaveBeenCalledWith(mockResponse, 'refresh_token');
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
  });
});
