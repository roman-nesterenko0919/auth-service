import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleService } from '../drizzle.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DrizzleService],
  exports: [UserService]
})
export class UserModule {}
