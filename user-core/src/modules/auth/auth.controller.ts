import { TransformPlainToClass } from "@nestjs/class-transformer";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IntrospectInputSchema } from "./schemas/introspect-input.schema";
import { LoginInputSchema } from "./schemas/login-input.schema";
import { UserLoginResponseSchema } from "./schemas/user-login-response.schema";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @TransformPlainToClass(UserLoginResponseSchema)
  async login(
    @Body() loginInputSchema: LoginInputSchema
  ): Promise<UserLoginResponseSchema> {
    return this.authService.login(loginInputSchema);
  }

  @Post("introspect")
  @HttpCode(HttpStatus.OK)
  async introspect(
    @Body() introspectInput: IntrospectInputSchema
  ): Promise<void> {
    await this.authService.introspect(introspectInput);
  }
}
