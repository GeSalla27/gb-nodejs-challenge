import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { StatusEnum } from "./enums/status.enum";
import { PurchaseIntegration } from "./purchase.integration";
import { AccumulatedCashBackResponseSchema } from "./schemas/accumulated-cash-back-response.schema";
import { PurchaseCashBackResponseSchema } from "./schemas/purchase-cash-back-response.schema";
import { PurchaseInputSchema } from "./schemas/purchase-input.schema";
import { PurchaseResponseSchema } from "./schemas/purchase-response.schema";

@Injectable()
export class PurchaseService {
  constructor(
    private readonly purchaseIntegration: PurchaseIntegration,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async create(
    purchaseInputSchema: PurchaseInputSchema,
    userId: string
  ): Promise<PurchaseResponseSchema> {
    this.logger.info("Creating new purchase attempt");

    const purchaseInputType = {
      code: purchaseInputSchema.code,
      value: purchaseInputSchema.value,
      date: purchaseInputSchema.date,
      cpf: purchaseInputSchema.cpf,
      user_id: userId,
      status:
        purchaseInputSchema.cpf === "15350946056"
          ? StatusEnum.APPROVED
          : StatusEnum.IN_VALIDATION,
    };

    return this.purchaseIntegration.create(purchaseInputType);
  }

  async getUserPurchasesCashBack(
    userId: string
  ): Promise<PurchaseCashBackResponseSchema[]> {
    this.logger.info("Get user purchases cash back attempt");

    return this.purchaseIntegration.findPurchases({ user_id: userId });
  }

  async getAccumulatedUserCashBack(
    userCpf: string
  ): Promise<AccumulatedCashBackResponseSchema> {
    this.logger.info("Get accumulated user cash back attempt");

    return this.purchaseIntegration.getAccumulatedUserCashBack(userCpf);
  }
}
