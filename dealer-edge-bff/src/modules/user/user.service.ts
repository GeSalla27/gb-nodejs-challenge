import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { UserInputSchema } from "./schemas/user-input.schema";
import { UserResponseSchema } from "./schemas/user-response.schema";
import { UserIntegration } from "./user.integration";

@Injectable()
export class UserService {
  constructor(
    private readonly userIntegration: UserIntegration,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async create(userInputSchema: UserInputSchema): Promise<UserResponseSchema> {
    this.logger.info("Create user attempt");

    return this.userIntegration.create(userInputSchema);
  }
}
