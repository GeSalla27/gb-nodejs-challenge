import { plainToClass } from "@nestjs/class-transformer";
import { UserEntity } from "../../entities/user.entity";

export class UserEntityHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      full_name: "Gabriel Salla",
      cpf: "03651198066",
      email: "gabrielsalla@outlook.com",
      password: "Senha@123",
    };
  }

  static createClass(): UserEntity {
    return plainToClass(UserEntity, UserEntityHelper.createPlain());
  }
}
