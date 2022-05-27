import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { plainToClass } from "class-transformer";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { UserService } from "../user/user.service";
import { IntrospectInputSchema } from "./schemas/introspect-input.schema";
import { LoginInputSchema } from "./schemas/login-input.schema";
import { UserLoginResponseSchema } from "./schemas/user-login-response.schema";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async login(
    loginInputSchema: LoginInputSchema
  ): Promise<UserLoginResponseSchema> {
    const [userFinded] = await this.userService.findUserWithCredentials({
      email: loginInputSchema.email,
    });

    if (!userFinded) {
      throw new UnauthorizedException();
    }

    if (loginInputSchema.password !== userFinded.password) {
      throw new UnauthorizedException();
    }

    const payload = {
      email: loginInputSchema.email,
      user_id: userFinded.id,
      cpf: userFinded.cpf,
    };
    const accessToken = this.jwtService.sign(payload);

    return plainToClass(UserLoginResponseSchema, {
      user: userFinded,
      access_token: accessToken,
    });
  }

  async introspect(introspectInput: IntrospectInputSchema): Promise<void> {
    const decodedToken = this.jwtService.verify(introspectInput.access_token);

    if (!decodedToken || typeof decodedToken === "string") {
      throw new UnauthorizedException("Decoded token is malformed");
    }

    await this.userService.findOneOrFail(decodedToken.user_id);

    this.logger.warn(`decodedToken ${JSON.stringify(decodedToken)}`);
  }
}
