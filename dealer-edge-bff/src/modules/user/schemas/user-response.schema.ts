import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class UserResponseSchema {
  @Expose()
  id: string;

  @Expose()
  full_name: string;

  @Expose()
  cpf: string;

  @Expose()
  email: string;
}
