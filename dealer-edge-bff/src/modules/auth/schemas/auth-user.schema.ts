import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class AuthUserSchema {
  @Expose()
  user_id: string;

  @Expose()
  cpf: string;

  @Expose()
  access_token: string;
}
