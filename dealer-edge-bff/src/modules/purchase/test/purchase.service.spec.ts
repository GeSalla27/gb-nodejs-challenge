import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { PurchaseIntegration } from "../purchase.integration";
import { PurchaseService } from "../purchase.service";
import { AccumulatedCashBackResponseSchemaHelper } from "./helpers/accumulated-cash-back-response.helper.schema";
import { PurchaseCashBackResponseSchemaHelper } from "./helpers/purchase-cash-back-response.helper.schema";
import { PurchaseInputSchemaHelper } from "./helpers/purchase-input.schema.helper";
import { PurchaseResponseSchemaHelper } from "./helpers/purchase-response.schema.helper";

describe("PurchaseService", () => {
  const logger = sinon.stub(winston.createLogger());
  const purchaseIntegration = sinon.createStubInstance(PurchaseIntegration);
  let purchaseService: PurchaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        {
          module: WinstonModule,
          providers: [{ provide: WINSTON_MODULE_PROVIDER, useValue: logger }],
          exports: [WINSTON_MODULE_PROVIDER],
        },
      ],
      providers: [
        PurchaseService,
        { provide: PurchaseIntegration, useValue: purchaseIntegration },
      ],
    }).compile();

    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe("createPurchase", () => {
    it("Should create a purchase", async () => {
      const purchaseInputSchemaHelper = PurchaseInputSchemaHelper.createPlain();
      const purchaseResponseSchemaHelper =
        PurchaseResponseSchemaHelper.createPlain();
      const userId = "4d13575f-64a1-4fd4-b96b-19a6e354388a";

      purchaseIntegration.create
        .withArgs(sinon.match(purchaseInputSchemaHelper))
        .resolves(purchaseResponseSchemaHelper);

      const purchaseResponse = await purchaseService.create(
        purchaseInputSchemaHelper,
        userId
      );

      assert.deepEqual(purchaseResponse, purchaseResponseSchemaHelper);

      sinon.assert.calledOnceWithExactly(
        purchaseIntegration.create,
        sinon.match(purchaseInputSchemaHelper)
      );
    });
  });

  it("Should create a purchase with specific cpf 15350946056", async () => {
    const purchaseInputSchemaHelper = PurchaseInputSchemaHelper.createPlain();
    const purchaseResponseSchemaHelper =
      PurchaseResponseSchemaHelper.createPlain();
    const userId = "f9dfad71-b682-43cf-87d3-e45865c2dc01";
    purchaseInputSchemaHelper.cpf = "15350946056";

    purchaseIntegration.create
      .withArgs(sinon.match(purchaseInputSchemaHelper))
      .resolves(purchaseResponseSchemaHelper);

    const purchaseResponse = await purchaseService.create(
      purchaseInputSchemaHelper,
      userId
    );

    assert.deepEqual(purchaseResponse, purchaseResponseSchemaHelper);

    sinon.assert.calledOnceWithExactly(
      purchaseIntegration.create,
      sinon.match(purchaseInputSchemaHelper)
    );
  });

  describe("getUserPurchasesCashBack", () => {
    it("Should return user purchase cash back", async () => {
      const purchaseCashBackResponseSchemaHelper =
        PurchaseCashBackResponseSchemaHelper.createPlain();
      const userId = "4d13575f-64a1-4fd4-b96b-19a6e354388a";

      purchaseIntegration.findPurchases
        .withArgs(sinon.match({ user_id: userId }))
        .resolves(purchaseCashBackResponseSchemaHelper);

      const purchaseCashBackResponse =
        await purchaseService.getUserPurchasesCashBack(userId);

      assert.deepEqual(
        purchaseCashBackResponse,
        purchaseCashBackResponseSchemaHelper
      );

      sinon.assert.calledOnceWithExactly(
        purchaseIntegration.findPurchases,
        sinon.match({ user_id: userId })
      );
    });
  });

  describe("getAccumulatedUserCashBack", () => {
    it("Should return accumulated user cash back", async () => {
      const accumulatedCashBackResponseSchemaHelper =
        AccumulatedCashBackResponseSchemaHelper.createPlain();
      const userCpf = "03651198070";

      purchaseIntegration.getAccumulatedUserCashBack
        .withArgs(sinon.match(userCpf))
        .resolves(accumulatedCashBackResponseSchemaHelper);

      const accumulatedUserCashBackResponse =
        await purchaseService.getAccumulatedUserCashBack(userCpf);

      assert.deepEqual(
        accumulatedUserCashBackResponse,
        accumulatedCashBackResponseSchemaHelper
      );

      sinon.assert.calledOnceWithExactly(
        purchaseIntegration.getAccumulatedUserCashBack,
        sinon.match(userCpf)
      );
    });
  });
});
