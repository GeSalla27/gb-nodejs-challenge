import { Exclude, Expose } from "@nestjs/class-transformer";
import { StatusEnum } from "../enums/status.enum";

@Exclude()
export class PurchaseCashBackResponseSchema {
  @Expose()
  code: string;

  @Expose()
  purchase_value: number;

  @Expose()
  date: Date;

  @Expose()
  cash_back_percentage: string;

  @Expose()
  cash_back_value: number;

  @Expose()
  status: StatusEnum;

  @Expose()
  amount_month: number;
}
