import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsDateString, IsNumber, IsString } from "@nestjs/class-validator";

@Exclude()
export class PurchaseInputSchema {
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
}
