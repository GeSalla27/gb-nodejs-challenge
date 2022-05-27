import { plainToClass } from "@nestjs/class-transformer";
import { UserInputSchema } from "../../schemas/user-input.schema";

export class UserInputSchemaHelper {
  static createPlain(): any {
    return {
      full_name: "Joana Silva",
      cpf: "03651198070",
      email: "joanasilva2@gmail.com",
      password: "Teste@123",
    };
  }

  static createClass(): UserInputSchema {
    return plainToClass(UserInputSchema, UserInputSchemaHelper.createPlain());
  }
}
