import { plainToClass } from "@nestjs/class-transformer";
import { UserInputSchema } from "../../schemas/user-input.schema";

export class UserInputSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: "a8139008-7768-447a-81d4-cd911fce19eb",
      full_name: "Gabriel Challenge",
      cpf: "03651198066",
      password: "Senha@123",
      email: "gabrielsalla@outlook.com",
    };
  }

  static createClass(): UserInputSchema {
    return plainToClass(UserInputSchema, UserInputSchemaHelper.createPlain());
  }
}
