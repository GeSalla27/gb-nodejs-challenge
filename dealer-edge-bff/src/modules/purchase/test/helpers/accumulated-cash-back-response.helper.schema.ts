import { plainToClass } from "@nestjs/class-transformer";
import { AccumulatedCashBackResponseSchema } from "../../schemas/accumulated-cash-back-response.schema";

export class AccumulatedCashBackResponseSchemaHelper {
  static createPlain(): any {
    return {
      credit: 32412,
    };
  }

  static createClass(): AccumulatedCashBackResponseSchema {
    return plainToClass(
      AccumulatedCashBackResponseSchema,
      AccumulatedCashBackResponseSchemaHelper.createPlain()
    );
  }
}
