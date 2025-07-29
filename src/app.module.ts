import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis.provider';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, RedisModule],
})
export class AppModule {}
