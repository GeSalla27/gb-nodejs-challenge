import { plainToClass } from "@nestjs/class-transformer";
import { UserListQuerySchema } from "../../schemas/user-list-query.schema";

export class UserListQuerySchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      email: "gabrielsalla@outlook.com",
    };
  }

  static createClass(): UserListQuerySchema {
    return plainToClass(
      UserListQuerySchema,
      UserListQuerySchemaHelper.createPlain()
    );
  }
}
