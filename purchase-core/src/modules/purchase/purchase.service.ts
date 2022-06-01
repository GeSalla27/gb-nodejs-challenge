import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PurchaseEntity } from "./entities/purchase.entity";
import { PurchaseRepository } from "./purchase.repository";
import { PurchaseCashBackResponseSchema } from "./schemas/purchase-cash-back-response.schema";
import { PurchaseInputSchema } from "./schemas/purchase-input.schema";
import { PurchaseListQuerySchema } from "./schemas/purchase-list-query.schema";
import { PurchaseResponseSchema } from "./schemas/purchase-response.schema";
import { PurchaseFilter } from "./types/purchase-filter.type";
import { PurchaseInputType } from "./types/purchase-input.type";

@Injectable()
export class PurchaseService {
  constructor(
    private readonly purchaseRepository: PurchaseRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  static calculatePercentageCashBack(value: number): string {
    if (value <= 1000) return "10%";
    if (value > 1000 && value <= 1500) return "15%";
    if (value > 1500) return "20%";

    return "";
  }

  static calculatePurchaseCashBack(
    purchaseValue: number,
    amountMonthPurchases: number
  ): number {
    let purchasePercentage = 0;

    if (amountMonthPurchases <= 1000) purchasePercentage = 10;
    if (amountMonthPurchases > 1000 && amountMonthPurchases <= 1500)
      purchasePercentage = 15;
    if (amountMonthPurchases > 1500) purchasePercentage = 20;

    return (purchasePercentage / 100) * purchaseValue;
  }

  static async returnSchemaPurchaseCashBack(
    amountPurchaseMonth: any[]
  ): Promise<PurchaseCashBackResponseSchema[]> {
    let filterPurchase: any[] = [];

    const cashBackResponseSchema = amountPurchaseMonth.map((purchase) => {
      filterPurchase = amountPurchaseMonth.filter(
        (element) => element.month_year === purchase.month_year
      );

      const sumAmountMouth = filterPurchase.reduce(
        (sum, current) => sum + Number(current.value),
        0
      );

      const cashBackPercentage =
        PurchaseService.calculatePercentageCashBack(sumAmountMouth);

      return {
        code: purchase.code,
        purchase_value: purchase.value,
        amount_month: sumAmountMouth,
        date: purchase.date,
        cash_back_percentage: cashBackPercentage,
        cash_back_value: PurchaseService.calculatePurchaseCashBack(
          purchase.value,
          sumAmountMouth
        ),
        status: purchase.status,
      };
    });

    await Promise.all(cashBackResponseSchema);

    return cashBackResponseSchema;
  }

  async create(
    purchaseInputSchema: PurchaseInputSchema
  ): Promise<PurchaseResponseSchema> {
    const purchaseInputType: PurchaseInputType = {
      id: purchaseInputSchema.id ? purchaseInputSchema.id : undefined,
      code: purchaseInputSchema.code,
      value: purchaseInputSchema.value,
      date: purchaseInputSchema.date,
      cpf: purchaseInputSchema.cpf,
      user_id: purchaseInputSchema.user_id,
      status: purchaseInputSchema.status,
    };

    this.logger.info("Creating new purchase");

    return this.purchaseRepository.save(purchaseInputType);
  }

  async findOne(id: string): Promise<PurchaseResponseSchema | null> {
    return this.purchaseRepository.findOne(id);
  }

  async findOneOrFail(id: string): Promise<PurchaseResponseSchema> {
    const purchase = await this.purchaseRepository.findOne(id);

    if (!purchase) {
      this.logger.warn("PurchaseEntity not found");
      throw new NotFoundException({ messageError: "PurchaseEntity not found" });
    }

    return purchase;
  }

  find(params: PurchaseListQuerySchema): Promise<PurchaseResponseSchema[]> {
    const filters: PurchaseFilter = params;

    this.logger.info("Finding purchases");

    return this.purchaseRepository.find(filters);
  }

  async update(
    id: string,
    attrs: Partial<PurchaseEntity>
  ): Promise<PurchaseResponseSchema> {
    await this.findOneOrFail(id);
    return this.purchaseRepository.update({
      ...attrs,
      id,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOneOrFail(id);

    await this.purchaseRepository.delete(id);
  }

  async getUserPurchasesCashBack(
    params: PurchaseListQuerySchema
  ): Promise<PurchaseCashBackResponseSchema[]> {
    this.logger.info("Finding cash back purchases");

    const purchasesFinded = await this.purchaseRepository.find(params);
    const amountPurchaseMonth = purchasesFinded
      // eslint-disable-next-line no-nested-ternary
      .sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0))
      .map((purchase) => {
        const monthYear = `${purchase.date.getMonth() + 1}`.concat(
          `${purchase.date.getFullYear()}`
        );

        return {
          id: purchase.id,
          code: purchase.code,
          value: purchase.value,
          date: purchase.date,
          status: purchase.status,
          month_year: monthYear,
        };
      });

    await Promise.all(amountPurchaseMonth);

    this.logger.info("Applying cash back purchases");

    return PurchaseService.returnSchemaPurchaseCashBack(amountPurchaseMonth);
  }
}
