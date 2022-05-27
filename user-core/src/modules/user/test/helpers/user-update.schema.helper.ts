import { plainToClass } from "@nestjs/class-transformer";
import { UserUpdateSchema } from "../../schemas/user-update.schema";

export class UserUpdateSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      full_name: " Gabreiel Salla Alterado",
      email: "gabrielsallaalterado@outlook.com",
    };
  }

  static createClass(): UserUpdateSchema {
    return plainToClass(UserUpdateSchema, UserUpdateSchemaHelper.createPlain());
  }
}
