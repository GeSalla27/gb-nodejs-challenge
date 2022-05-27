import { Exclude, Expose, Type } from "@nestjs/class-transformer";
import { UserResponseSchema } from "../../user/schemas/user-response.schema";

@Exclude()
export class UserLoginResponseSchema {
  @Expose()
  @Type(() => UserResponseSchema)
  user: UserResponseSchema;

  @Expose()
  access_token: string;
}
