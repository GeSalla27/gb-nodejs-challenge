import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsOptional, IsString } from "@nestjs/class-validator";

@Exclude()
export class UserUpdateSchema {
  id: string;

  @Expose()
  @IsString()
  @IsOptional()
  full_name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  cpf?: string;

  @Expose()
  @IsString()
  @IsOptional()
  email?: string;
}
