import { HttpService } from "@nestjs/axios";
import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import env from "../../app.env";
import { IntrospectInputSchema } from "./schemas/introspect-input.schema";
import { LoginInputSchema } from "./schemas/login-input.schema";
import { UserLoginResponseSchema } from "./schemas/user-login-response.schema";

@Injectable()
export class AuthIntegration {
  constructor(private readonly httpService: HttpService) {}

  static getUserAuthBaseUrlCore(): string {
    return `${env.USER_CORE_URL}/auth`;
  }

  async login(
    loginInputSchema: LoginInputSchema
  ): Promise<UserLoginResponseSchema> {
    try {
      const observable = this.httpService.post(
        `${`${AuthIntegration.getUserAuthBaseUrlCore()}/login`}`,
        loginInputSchema
      );

      const { data } = await firstValueFrom(observable);

      return data;
    } catch (error: any) {
      if (error?.isAxiosError) {
        switch (error.response?.status) {
          case HttpStatus.UNAUTHORIZED:
            throw new UnauthorizedException();
          case HttpStatus.UNPROCESSABLE_ENTITY:
            throw new UnprocessableEntityException();
          default:
        }
      }

      throw error;
    }
  }

  async introspect(introspectInput: IntrospectInputSchema): Promise<void> {
    const observable = this.httpService.post(
      `${`${AuthIntegration.getUserAuthBaseUrlCore()}/introspect`}`,
      introspectInput
    );

    await firstValueFrom(observable);
  }
}
