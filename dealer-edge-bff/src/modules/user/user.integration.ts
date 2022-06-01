import { HttpService } from "@nestjs/axios";
import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import env from "../../app.env";
import { UserInputSchema } from "./schemas/user-input.schema";
import { UserResponseSchema } from "./schemas/user-response.schema";

@Injectable()
export class UserIntegration {
  constructor(private readonly httpService: HttpService) {}

  static getUserBaseUrlCore(): string {
    return `${env.USER_CORE_URL}/users`;
  }

  async create(userInputSchema: UserInputSchema): Promise<UserResponseSchema> {
    try {
      const observable = this.httpService.post(
        UserIntegration.getUserBaseUrlCore(),
        userInputSchema
      );

      const { data } = await firstValueFrom(observable);

      return data;
    } catch (error: any) {
      if (error?.isAxiosError) {
        switch (error.response?.status) {
          case HttpStatus.CONFLICT:
            throw new ConflictException(error.response?.data?.messageError);
          case HttpStatus.UNPROCESSABLE_ENTITY:
            throw new UnprocessableEntityException();
          default:
        }
      }

      throw error;
    }
  }
}
