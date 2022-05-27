import { plainToClass } from "@nestjs/class-transformer";
import { UserLoginSchema } from "../../../auth/schemas/user-login.schema";
import { LoginInputSchemaHelper } from "../../../auth/test/helpers/login-input.schema.helper";

export class UserLoginSchemaHelper {
  static createPlain(): any {
    const userLoginSchemaHelper = LoginInputSchemaHelper.createClass();

    return {
      user: userLoginSchemaHelper,
    };
  }

  static createClass(): UserLoginSchema {
    return plainToClass(UserLoginSchema, UserLoginSchemaHelper.createPlain());
  }
}
