import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { UserEntity } from "./entities/user.entity";
import { UserInputSchema } from "./schemas/user-input.schema";
import { UserListQuerySchema } from "./schemas/user-list-query.schema";
import { UserResponseSchema } from "./schemas/user-response.schema";
import { UserFilter } from "./types/user-filter.type";
import { UserInputType } from "./types/user-input.type";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async create(userInputSchema: UserInputSchema): Promise<UserResponseSchema> {
    const existUser = await this.usersRepository.exists({
      email: userInputSchema.email,
    });

    if (existUser) {
      throw new ConflictException({
        messageError: "There is a user with this email",
      });
    }

    const userInputType: UserInputType = {
      id: userInputSchema.id ? userInputSchema.id : undefined,
      full_name: userInputSchema.full_name,
      cpf: userInputSchema.cpf,
      email: userInputSchema.email,
      password: userInputSchema.password,
    };

    this.logger.info("Creating new user");

    return this.usersRepository.save(userInputType);
  }

  async findOne(id: string): Promise<UserResponseSchema | null> {
    return this.usersRepository.findOne(id);
  }

  async findOneOrFail(id: string): Promise<UserResponseSchema> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      this.logger.warn("UserEntity not found");
      throw new NotFoundException({ messageError: "UserEntity not found" });
    }

    return user;
  }

  find(params: UserListQuerySchema): Promise<UserResponseSchema[]> {
    const filters: UserFilter = params;

    this.logger.info("Finding users");

    return this.usersRepository.find(filters);
  }

  findUserWithCredentials(params: UserListQuerySchema): Promise<UserEntity[]> {
    const filters: UserFilter = params;

    this.logger.info("Finding users");

    return this.usersRepository.find(filters);
  }

  async update(
    id: string,
    attrs: Partial<UserEntity>
  ): Promise<UserResponseSchema> {
    await this.findOneOrFail(id);
    return this.usersRepository.update({
      ...attrs,
      id,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOneOrFail(id);

    await this.usersRepository.delete(id);
  }
}
