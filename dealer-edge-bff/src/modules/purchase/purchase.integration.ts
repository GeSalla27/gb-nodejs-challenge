import { HttpService } from "@nestjs/axios";
import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import env from "../../app.env";
import { AccumulatedCashBackResponseSchema } from "./schemas/accumulated-cash-back-response.schema";
import { PurchaseCashBackResponseSchema } from "./schemas/purchase-cash-back-response.schema";
import { PurchaseResponseSchema } from "./schemas/purchase-response.schema";
import { PurchaseInputType } from "./types/purchase-input.type";
import { PurchaseListQueryType } from "./types/purchase-list-query.type";

@Injectable()
export class PurchaseIntegration {
  constructor(private readonly httpService: HttpService) {}

  static getPurchaseBaseUrlCore(): string {
    return `${env.PURCHASE_CORE_URL}/purchases`;
  }

  static getIntegrationBoticarioUrl(): string {
    return "https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1";
  }

  async create(
    purchaseInputSchema: PurchaseInputType
  ): Promise<PurchaseResponseSchema> {
    try {
      const observable = this.httpService.post(
        PurchaseIntegration.getPurchaseBaseUrlCore(),
        purchaseInputSchema
      );

      const { data } = await firstValueFrom(observable);

      return data;
    } catch (error: any) {
      if (error?.isAxiosError) {
        switch (error.response?.status) {
          case HttpStatus.CONFLICT:
            throw new ConflictException(error.response?.data?.messageError);
          case HttpStatus.UNPROCESSABLE_ENTITY:
            throw new UnprocessableEntityException();
          default:
        }
      }

      throw error;
    }
  }

  async findPurchases(
    filters: PurchaseListQueryType
  ): Promise<PurchaseCashBackResponseSchema[]> {
    const observable = this.httpService.get(
      `${PurchaseIntegration.getPurchaseBaseUrlCore().concat("/cashback")}`,
      {
        params: filters,
      }
    );

    const { data } = await firstValueFrom(observable);

    return data;
  }

  async getAccumulatedUserCashBack(
    userCpf: string
  ): Promise<AccumulatedCashBackResponseSchema> {
    const filters = { cpf: userCpf };

    const observable = this.httpService.get(
      PurchaseIntegration.getIntegrationBoticarioUrl().concat("/cashback"),
      {
        headers: { Authorization: "Bearer ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm" },
        params: filters,
      }
    );

    const { data } = await firstValueFrom(observable);

    return data.body;
  }
}
