import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { IntrospectInputSchema } from "./schemas/introspect-input.schema";
import { AuthIntegration } from "./auth.integration";
import { LoginInputSchema } from "./schemas/login-input.schema";
import { UserLoginResponseSchema } from "./schemas/user-login-response.schema";

@Injectable()
export class AuthService {
  constructor(
    private authIntegration: AuthIntegration,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async login(
    loginInputSchema: LoginInputSchema
  ): Promise<UserLoginResponseSchema> {
    this.logger.info("Login attempt");
    return this.authIntegration.login(loginInputSchema);
  }

  async introspect(introspectInput: IntrospectInputSchema): Promise<void> {
    this.logger.info("Introspect user attempt");

    await this.authIntegration.introspect(introspectInput);
  }
}
