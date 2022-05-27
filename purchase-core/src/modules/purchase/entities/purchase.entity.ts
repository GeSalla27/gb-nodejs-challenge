import { StatusEnum } from "../enums/status.enum";

export class PurchaseEntity {
  id: string;

  code: string;

  value: number;

  date: Date;

  cpf: string;

  user_id: string;

  status: StatusEnum;
}
