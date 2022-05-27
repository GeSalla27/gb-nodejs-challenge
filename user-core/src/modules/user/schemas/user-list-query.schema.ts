import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsOptional, IsString } from "@nestjs/class-validator";

@Exclude()
export class UserListQuerySchema {
  @Expose()
  @IsOptional()
  @IsString()
  full_name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  cpf?: string;

  @Expose()
  @IsOptional()
  @IsString()
  email?: string;
}
