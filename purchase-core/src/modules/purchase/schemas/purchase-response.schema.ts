import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class PurchaseResponseSchema {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  value: number;

  @Expose()
  date: Date;

  @Expose()
  cpf: string;

  @Expose()
  user_id: string;

  @Expose()
  status: string;
}
