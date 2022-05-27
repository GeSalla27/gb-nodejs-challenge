import { Exclude, Expose } from "@nestjs/class-transformer";
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "@nestjs/class-validator";
import { StatusEnum } from "../enums/status.enum";

@Exclude()
export class PurchaseInputSchema {
  @Expose()
  @IsString()
  @IsOptional()
  id?: string;

  @Expose()
  @IsString()
  code: string;

  @Expose()
  @IsNumber()
  value: number;

  @Expose()
  @IsDateString({ strict: true })
  date: Date;

  @Expose()
  @IsString()
  cpf: string;

  @Expose()
  @IsString()
  user_id: string;

  @Expose()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
