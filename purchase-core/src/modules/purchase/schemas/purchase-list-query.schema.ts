import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsOptional, IsString } from "@nestjs/class-validator";

@Exclude()
export class PurchaseListQuerySchema {
  @Expose()
  @IsOptional()
  @IsString()
  code?: string;

  @Expose()
  @IsOptional()
  @IsString()
  cpf?: string;

  @Expose()
  @IsOptional()
  @IsString()
  user_id?: string;
}
