import { AuthGuard } from "@nestjs/passport";
import { UseGuards } from "@nestjs/common";

export const Auth = () => UseGuards(AuthGuard('jwt'));
