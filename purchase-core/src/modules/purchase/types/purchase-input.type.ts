import { StatusEnum } from "../enums/status.enum";

export type PurchaseInputType = {
  id?: string;
  code: string;
  value: number;
  date: Date;
  cpf: string;
  user_id: string;
  status: StatusEnum;
};
