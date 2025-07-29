import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userServiceMock: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtServiceMock: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userServiceMock = {
      getByEmail: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
    };
    jwtServiceMock = {
      sign: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = testingModule.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should throw BadRequestException if user already exists', async () => {
      userServiceMock.getByEmail!.mockResolvedValue({ id: 1, email: 'test@test.com' });

      await expect(service.register({ email: 'test@test.com', password: '1234567', username: 'us1', fullname: 'Full Test Name' }))
        .rejects.toThrow(BadRequestException);
    });

    it('should create new user', async () => {
      userServiceMock.getByEmail!.mockResolvedValue(null);
      userServiceMock.create!.mockResolvedValue({ id: 1, email: 'test5@test.com', password: 'hashedPassword', username: 'us2', fullname: 'f' });
      jwtServiceMock.sign!.mockReturnValue('token');

      const result = await service.register({ email: 'test5@test.com', password: '1234567', username: 'us2', fullname: 'f' });

      expect(userServiceMock.create).toHaveBeenCalled();
      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
    });
  });

  describe('login', () => {
    it('should throw NotFoundException if user not found', async () => {
      userServiceMock.getByEmail!.mockResolvedValue(null);

      await expect(service.login({ email: 'unknown_user@test.com', password: '1234567' }))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password wrong', async () => {
      const user = { id: 1, password: 'hashedPassword', email: 'test@test.com' };
      userServiceMock.getByEmail!.mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(service.login({ email: 'test@test.com', password: 'wrongPassword' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should return user if success', async () => {
      const user = { id: 1, password: 'hashedPassword', email: 'test@test.com' };
      userServiceMock.getByEmail!.mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      jwtServiceMock.sign!.mockReturnValue('token');

      const result = await service.login({ email: 'test@test.com', password: 'correctPassword' });

      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
    });
  });

  describe('getNewTokens', () => {
    it('should throw UnauthorizedException if token invalid', async () => {
      jwtServiceMock.verifyAsync!.mockRejectedValue(new UnauthorizedException());

      await expect(service.getNewTokens('invalidToken')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if user not found', async () => {
      jwtServiceMock.verifyAsync!.mockResolvedValue({ id: 1 });
      userServiceMock.getById!.mockResolvedValue(null);

      await expect(service.getNewTokens('validToken')).rejects.toThrow(NotFoundException);
    });

    it('should return new tokens on success', async () => {
      const user = { id: 1, password: 'hashed', email: 'test@test.com' };
      jwtServiceMock.verifyAsync!.mockResolvedValue({ id: 1 });
      userServiceMock.getById!.mockResolvedValue(user);
      jwtServiceMock.sign!.mockReturnValue('token');

      const result = await service.getNewTokens('validToken');

      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
    });
  });
});
