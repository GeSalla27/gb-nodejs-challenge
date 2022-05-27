import { plainToClass } from "@nestjs/class-transformer";
import { StatusEnum } from "../../enums/status.enum";
import { PurchaseResponseSchema } from "../../schemas/purchase-response.schema";

export class PurchaseResponseSchemaHelper {
  static createPlain(): any {
    return {
      id: "8dcb7f98-3f54-4433-8b62-3186949b62e8",
      code: "L6bmSmDE",
      value: 200,
      date: "2022-05-26T15:48:29.561Z",
      cpf: "03651198070",
      user_id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      status: StatusEnum.IN_VALIDATION,
    };
  }

  static createClass(): PurchaseResponseSchema {
    return plainToClass(
      PurchaseResponseSchema,
      PurchaseResponseSchemaHelper.createPlain()
    );
  }
}
