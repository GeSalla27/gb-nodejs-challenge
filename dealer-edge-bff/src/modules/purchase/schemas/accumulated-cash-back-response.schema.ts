import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class AccumulatedCashBackResponseSchema {
  @Expose()
  credit: number;
}
