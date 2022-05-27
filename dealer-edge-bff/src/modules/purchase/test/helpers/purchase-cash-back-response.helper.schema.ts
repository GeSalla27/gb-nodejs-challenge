import { plainToClass } from "@nestjs/class-transformer";
import { StatusEnum } from "../../enums/status.enum";
import { PurchaseCashBackResponseSchema } from "../../schemas/purchase-cash-back-response.schema";

export class PurchaseCashBackResponseSchemaHelper {
  static createPlain(): any {
    return {
      code: "L6bmSmDE",
      purchase_value: 200,
      date: "2022-05-26T15:48:29.561Z",
      cash_back_percentage: "10%",
      cash_back_value: "20",
      status: StatusEnum.IN_VALIDATION,
      amount_month: 200,
    };
  }

  static createClass(): PurchaseCashBackResponseSchema {
    return plainToClass(
      PurchaseCashBackResponseSchema,
      PurchaseCashBackResponseSchemaHelper.createPlain()
    );
  }
}
