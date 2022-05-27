import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class AuthenticatedUserSchema {
  @Expose()
  access_token: string;
}
