import type { users } from "../../drizzle/schema";
import { InferSelectModel } from 'drizzle-orm';
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

type User = InferSelectModel<typeof users>;

export const CurrentUser = createParamDecorator(
    (data: keyof User, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user[data] : user;
    }
)