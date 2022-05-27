import { TransformPlainToClass } from "@nestjs/class-transformer";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { PurchaseCashBackResponseSchema } from "./schemas/purchase-cash-back-response.schema";
import { PurchaseInputSchema } from "./schemas/purchase-input.schema";
import { PurchaseListQuerySchema } from "./schemas/purchase-list-query.schema";
import { PurchaseResponseSchema } from "./schemas/purchase-response.schema";

@Controller("purchases")
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post("")
  @TransformPlainToClass(PurchaseResponseSchema)
  async createPurchase(
    @Body() purchaseInputSchema: PurchaseInputSchema
  ): Promise<PurchaseResponseSchema> {
    return this.purchaseService.create(purchaseInputSchema);
  }

  @Get("")
  @TransformPlainToClass(PurchaseResponseSchema)
  findPurchases(
    @Query() purchaseListQuerySchema: PurchaseListQuerySchema
  ): Promise<PurchaseResponseSchema[]> {
    return this.purchaseService.find(purchaseListQuerySchema);
  }

  @Get("cash-back")
  @TransformPlainToClass(PurchaseCashBackResponseSchema)
  getUserPurchasesCashBack(
    @Query() purchaseListQuerySchema: PurchaseListQuerySchema
  ): Promise<PurchaseCashBackResponseSchema[]> {
    return this.purchaseService.getUserPurchasesCashBack(
      purchaseListQuerySchema
    );
  }
}
