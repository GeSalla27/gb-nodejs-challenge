import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsOptional, IsString } from "@nestjs/class-validator";

@Exclude()
export class UserInputSchema {
  @Expose()
  @IsString()
  @IsOptional()
  id?: string;

  @Expose()
  @IsString()
  full_name: string;

  @Expose()
  @IsString()
  cpf: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  password: string;
}
