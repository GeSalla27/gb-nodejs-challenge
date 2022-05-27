import { plainToClass } from "@nestjs/class-transformer";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUserSchema } from "../schemas/auth-user.schema";

export const Jwt = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const { authorization } = ctx.switchToHttp().getRequest();

    return plainToClass(AuthUserSchema, authorization);
  }
);
