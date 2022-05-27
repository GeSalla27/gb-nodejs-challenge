import { plainToClass } from "@nestjs/class-transformer";
import { LoginInputSchema } from "../../schemas/login-input.schema";

export class LoginInputSchemaHelper {
  static createPlain(): any {
    return {
      username: "gabrielsalla@outlook.com",
      password: "Senha@123",
    };
  }

  static createClass(): LoginInputSchema {
    return plainToClass(LoginInputSchema, LoginInputSchemaHelper.createPlain());
  }
}
