import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest'
import { AppModule } from "../src/app.module";
import { AuthModule } from "../src/auth/auth.module";

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    beforeAll(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule, AuthModule],
        }).compile()

        app = testingModule.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())
        await app.init()
    })

    it('/register (POST)', async () => {
        return await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: "test_user",
                email: "test12@test.com",
                password: "1234567",
                fullname: "Test Test",
            })
            .expect(201)
            .expect(response => {
                return response.body.email === "test12@test.com"
            })
    })

    it('/login (POST)', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: "test@test.com",
                password: "1234567",
            })
            .expect(200);
        expect(res.body.accessToken).toBeDefined();
        accessToken = res.body.accessToken;
        return res;
    })

    it('/user (GET)', async () => {
        return await request(app.getHttpServer())
            .get('/user')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .expect({
                user: {
                    id: 1,
                    username: "test_user",
                    email: "test@test.com",
                    fullname: "Test Test",
                    birthDate: null
                },
            })
    })

    afterAll(async () => {
        await app.close()
    })
})