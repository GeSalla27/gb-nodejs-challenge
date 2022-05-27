import { plainToClass } from "@nestjs/class-transformer";
import { AuthUserSchema } from "../../schemas/auth-user.schema";

export class AuthUserSchemaHelper {
  static createPlain(): any {
    return {
      user_id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      cpf: "03651198070",
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlZHJvZ2Vyb25pbm9Ab3V0bG9vay5jb20iLCJzdWIiOiI5NjY2ODI1Ny03N2VmLTQxNzEtOWY0Ni00NGM1NjU0MzkyOTYiLCJpYXQiOjE2NTIyMDQyNjIsImV4cCI6MTY1MjIwNDMyMn0.g-a8aM8OrwVIDDra18lsWqiV7lctwJy2ZHcuIO0_hx4",
    };
  }

  static createClass(): AuthUserSchema {
    return plainToClass(AuthUserSchema, AuthUserSchemaHelper.createPlain());
  }
}
