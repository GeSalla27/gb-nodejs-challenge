import { plainToClass } from "@nestjs/class-transformer";
import { UserResponseSchemaHelper } from "../../../user/test/helpers/user-response.schema.helper";
import { UserLoginResponseSchema } from "../../schemas/user-login-response.schema";

export class UserLoginResponseSchemaHelper {
  static createPlain(): any {
    const userResponseSchemaHelper = UserResponseSchemaHelper.createClass();
    return {
      user: userResponseSchemaHelper,
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlZHJvZ2Vyb25pbm9Ab3V0bG9vay5jb20iLCJzdWIiOiI5NjY2ODI1Ny03N2VmLTQxNzEtOWY0Ni00NGM1NjU0MzkyOTYiLCJpYXQiOjE2NTIyMDQyNjIsImV4cCI6MTY1MjIwNDMyMn0.g-a8aM8OrwVIDDra18lsWqiV7lctwJy2ZHcuIO0_hx4",
    };
  }

  static createClass(): UserLoginResponseSchema {
    return plainToClass(
      UserLoginResponseSchema,
      UserLoginResponseSchemaHelper.createPlain()
    );
  }
}
