import { plainToClass } from "@nestjs/class-transformer";
import { PurchaseInputSchema } from "../../schemas/purchase-input.schema";

export class PurchaseInputSchemaHelper {
  static createPlain(): any {
    return {
      code: "L6bmSmDE",
      value: 200,
      date: "2022-05-26T15:48:29.561Z",
      cpf: "03651198070",
    };
  }

  static createClass(): PurchaseInputSchema {
    return plainToClass(
      PurchaseInputSchema,
      PurchaseInputSchemaHelper.createPlain()
    );
  }
}
