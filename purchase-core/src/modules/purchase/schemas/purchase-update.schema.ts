import { Exclude, Expose } from "@nestjs/class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "@nestjs/class-validator";
import { StatusEnum } from "../enums/status.enum";

@Exclude()
export class PurchaseUpdateSchema {
  id: string;

  @Expose()
  @IsString()
  @IsOptional()
  code?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  value?: number;

  @Expose()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}
