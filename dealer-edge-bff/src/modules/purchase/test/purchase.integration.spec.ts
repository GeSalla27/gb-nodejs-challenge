import { HttpService } from "@nestjs/axios";
import {
  ConflictException,
  HttpStatus,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { of } from "rxjs";
import * as sinon from "sinon";
import env from "../../../app.env";
import { AxiosTestHelper } from "../../helpers/axios-test.helper";
import { PurchaseIntegration } from "../purchase.integration";
import { AccumulatedCashBackResponseSchemaHelper } from "./helpers/accumulated-cash-back-response.helper.schema";
import { PurchaseCashBackResponseSchemaHelper } from "./helpers/purchase-cash-back-response.helper.schema";
import { PurchaseInputSchemaHelper } from "./helpers/purchase-input.schema.helper";
import { PurchaseResponseSchemaHelper } from "./helpers/purchase-response.schema.helper";

describe("PurchaseIntegration", () => {
  const httpService = sinon.createStubInstance(HttpService);
  const baseUrl = `${env.PURCHASE_CORE_URL}/purchases`;

  let purchaseIntegration: PurchaseIntegration;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PurchaseIntegration,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    purchaseIntegration = module.get<PurchaseIntegration>(PurchaseIntegration);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe("createPurchase", () => {
    it("Should create a purchase", async () => {
      const purchaseInputSchemaHelper = PurchaseInputSchemaHelper.createPlain();
      const purchaseResponseSchemaHelper =
        PurchaseResponseSchemaHelper.createPlain();
      const url = `${baseUrl}`;
      const response = AxiosTestHelper.createAxiosResponse(
        HttpStatus.OK,
        purchaseResponseSchemaHelper
      );

      httpService.post
        .withArgs(url, purchaseInputSchemaHelper)
        .returns(of(response));

      const purchaseResponse = await purchaseIntegration.create(
        purchaseInputSchemaHelper
      );

      assert.deepEqual(purchaseResponse, purchaseResponseSchemaHelper);

      sinon.assert.calledWith(httpService.post, url, purchaseInputSchemaHelper);
    });
  });

  it.each([
    { status: HttpStatus.CONFLICT },
    { status: HttpStatus.UNPROCESSABLE_ENTITY },
    undefined,
  ])(
    "Should throw exception if create a purchase returns erros",
    async (response) => {
      const purchaseInputSchemaHelper = PurchaseInputSchemaHelper.createPlain();
      const url = `${baseUrl}`;
      const expectedError = {
        response,
        isAxiosError: true,
      };

      httpService.post
        .withArgs(url, purchaseInputSchemaHelper)
        .throws(expectedError);

      try {
        await purchaseIntegration.create(purchaseInputSchemaHelper);
      } catch (error) {
        if (expectedError.response?.status === HttpStatus.CONFLICT) {
          assert.instanceOf(error, ConflictException);
        }

        if (
          expectedError.response?.status === HttpStatus.UNPROCESSABLE_ENTITY
        ) {
          assert.instanceOf(error, UnprocessableEntityException);
        }

        return;
      }

      throw new Error("Expected error, but none found");
    }
  );

  describe("getUserPurchasesCashBack", () => {
    it("Should return user purchase cashback", async () => {
      const purchaseCashBackResponseSchemaHelper =
        PurchaseCashBackResponseSchemaHelper.createPlain();
      const url = `${baseUrl.concat("/cashback")}`;
      const response = AxiosTestHelper.createAxiosResponse(
        HttpStatus.OK,
        purchaseCashBackResponseSchemaHelper
      );

      const filters = { user_id: "4d13575f-64a1-4fd4-b96b-19a6e354388a" };

      httpService.get.withArgs(url, { params: filters }).returns(of(response));

      const purchaseCashBackResponse = await purchaseIntegration.findPurchases(
        filters
      );

      assert.deepEqual(
        purchaseCashBackResponse,
        purchaseCashBackResponseSchemaHelper
      );

      sinon.assert.calledWith(
        httpService.get,
        url,
        sinon.match({ params: filters })
      );
    });
  });

  describe("getAccumulatedUserCashBack", () => {
    it("Should return accumulated user cashback", async () => {
      const accumulatedCashBackResponseSchemaHelper =
        AccumulatedCashBackResponseSchemaHelper.createPlain();
      const body = { body: accumulatedCashBackResponseSchemaHelper };
      const userCpf = "03651198070";
      const url =
        PurchaseIntegration.getIntegrationBoticarioUrl().concat("/cashback");
      const response = AxiosTestHelper.createAxiosResponse(HttpStatus.OK, body);

      const headers = {
        Authorization: "Bearer ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm",
      };
      const params = { cpf: userCpf };
      const configs = { headers, params };

      httpService.get.withArgs(url, configs).returns(of(response));

      const accumulatedCashBackResponse =
        await purchaseIntegration.getAccumulatedUserCashBack(userCpf);

      assert.deepEqual(
        accumulatedCashBackResponse,
        accumulatedCashBackResponseSchemaHelper
      );

      sinon.assert.calledWith(httpService.get, url, sinon.match(configs));
    });
  });
});
