import { plainToClass } from "@nestjs/class-transformer";
import { LoginInputSchema } from "../../schemas/login-input.schema";

export class LoginInputSchemaHelper {
  static createPlain(): any {
    return {
      email: "joana.silva@gmail.com",
      password: "Teste@123",
    };
  }

  static createClass(): LoginInputSchema {
    return plainToClass(LoginInputSchema, LoginInputSchemaHelper.createPlain());
  }
}
