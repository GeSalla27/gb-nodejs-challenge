import { TransformPlainToClass } from "@nestjs/class-transformer";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { Jwt } from "../auth/decorators/jwt.decorator";
import { AuthUserSchema } from "../auth/schemas/auth-user.schema";
import { PurchaseService } from "./purchase.service";
import { AccumulatedCashBackResponseSchema } from "./schemas/accumulated-cash-back-response.schema";
import { PurchaseCashBackResponseSchema } from "./schemas/purchase-cash-back-response.schema";
import { PurchaseInputSchema } from "./schemas/purchase-input.schema";
import { PurchaseResponseSchema } from "./schemas/purchase-response.schema";

@Controller("purchases")
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post("")
  @HttpCode(HttpStatus.CREATED)
  @TransformPlainToClass(PurchaseResponseSchema)
  async createPurchase(
    @Jwt() token: AuthUserSchema,
    @Body() purchase: PurchaseInputSchema
  ): Promise<PurchaseResponseSchema> {
    return this.purchaseService.create(purchase, token.user_id);
  }

  @Get("")
  @TransformPlainToClass(PurchaseCashBackResponseSchema)
  async getUserPurchasesCashBack(
    @Jwt() token: AuthUserSchema
  ): Promise<PurchaseCashBackResponseSchema[]> {
    return this.purchaseService.getUserPurchasesCashBack(token.user_id);
  }

  @Get("accumulated-cash-back")
  @TransformPlainToClass(AccumulatedCashBackResponseSchema)
  async getAccumulatedUserCashBack(
    @Jwt() token: AuthUserSchema
  ): Promise<AccumulatedCashBackResponseSchema> {
    return this.purchaseService.getAccumulatedUserCashBack(token.cpf);
  }
}
