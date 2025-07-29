import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle.service';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { RegisterDto } from '../auth/dto/register.dto';
import { hash } from 'argon2';
import Redis from 'ioredis';

@Injectable()
export class UserService {
    constructor(private drizzle: DrizzleService, @Inject('REDIS') private redis: Redis) { }

    async getById(id: number) {
        const user = await this.drizzle.db.query.users.findFirst({
            where: eq(users.id, id),
        });

        if (!user) {
            throw new NotFoundException();
        }

        return user
    }

    async getByEmail(email: string) {
        const user = await this.drizzle.db.query.users.findFirst({
            where: eq(users.email, email),
        });

        return user
    }

    async create(dto: RegisterDto) {
        const hashPassword = await hash(dto.password)
        const [createdUser] = await this.drizzle.db.insert(users).values({
            username: dto.username, email: dto.email, password: hashPassword, fullname: dto.fullname, birthDate: dto.birthDate
        }).returning()
        return createdUser;
    }

    async getProfile(id: number) {
        const cached = await this.redis.get(`user:${id}`);

        if (cached) {
            return { user: JSON.parse(cached) };
        }

        const profile = await this.getById(id)

        const { password, createdAt, updatedAt, ...rest } = profile;

        await this.redis.set(`user:${id}`, JSON.stringify(rest), 'EX', 60 * 5);

        return {
            user: rest
        }
    }
}
