import { HttpStatus, INestApplication } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as request from "supertest";
import * as winston from "winston";
import { AuthService } from "../../auth/auth.service";
import { JwtGuard } from "../../auth/jwt.guard";
import { authHeaders } from "../../auth/test/helpers/headers.helper";
import { mockAuthFlow } from "../../helpers/test/auth-mock.helper";
import { PurchaseController } from "../purchase.controller";
import { PurchaseService } from "../purchase.service";
import { AccumulatedCashBackResponseSchemaHelper } from "./helpers/accumulated-cash-back-response.helper.schema";
import { PurchaseCashBackResponseSchemaHelper } from "./helpers/purchase-cash-back-response.helper.schema";
import { PurchaseInputSchemaHelper } from "./helpers/purchase-input.schema.helper";
import { PurchaseResponseSchemaHelper } from "./helpers/purchase-response.schema.helper";

describe("PurchaseController", () => {
  const purchaseService = sinon.createStubInstance(PurchaseService);
  const authService = sinon.createStubInstance(AuthService);
  const jwtService = sinon.createStubInstance(JwtService);
  const logger = sinon.stub(winston.createLogger());

  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: JwtService, useValue: jwtService },
        { provide: PurchaseService, useValue: purchaseService },
        { provide: APP_GUARD, useClass: JwtGuard },
        { provide: WINSTON_MODULE_PROVIDER, useValue: logger },
      ],
    }).compile();

    mockAuthFlow(jwtService, authService);

    app = module.createNestApplication();

    await app.init();
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

      purchaseService.create
        .withArgs(sinon.match(purchaseInputSchemaHelper), userId)
        .resolves(purchaseResponseSchemaHelper);

      return request(app.getHttpServer())
        .post("/purchases")
        .set(authHeaders)
        .send(purchaseInputSchemaHelper)
        .then((response) => {
          assert.equal(response.status, HttpStatus.CREATED);

          sinon.assert.calledOnceWithExactly(
            purchaseService.create,
            sinon.match(purchaseInputSchemaHelper),
            userId
          );

          assert.deepEqual(response.body, purchaseResponseSchemaHelper);
        });
    });
  });

  describe("getUserPurchasesCashBack", () => {
    it("Should return user purchase cash back", async () => {
      const purchaseCashBackResponseSchemaHelper =
        PurchaseCashBackResponseSchemaHelper.createPlain();
      const userId = "4d13575f-64a1-4fd4-b96b-19a6e354388a";

      purchaseService.getUserPurchasesCashBack
        .withArgs(userId)
        .resolves(purchaseCashBackResponseSchemaHelper);

      return request(app.getHttpServer())
        .get("/purchases")
        .set(authHeaders)
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          sinon.assert.calledOnceWithExactly(
            purchaseService.getUserPurchasesCashBack,
            userId
          );

          assert.deepEqual(response.body, purchaseCashBackResponseSchemaHelper);
        });
    });
  });

  describe("getAccumulatedUserCashBack", () => {
    it("Should return accumulated user cash back", async () => {
      const accumulatedCashBackResponseSchemaHelper =
        AccumulatedCashBackResponseSchemaHelper.createPlain();
      const userCpf = "03651198070";

      purchaseService.getAccumulatedUserCashBack
        .withArgs(userCpf)
        .resolves(accumulatedCashBackResponseSchemaHelper);

      return request(app.getHttpServer())
        .get("/purchases/accumulated-cash-back")
        .set(authHeaders)
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          sinon.assert.calledOnceWithExactly(
            purchaseService.getAccumulatedUserCashBack,
            userCpf
          );

          assert.deepEqual(
            response.body,
            accumulatedCashBackResponseSchemaHelper
          );
        });
    });
  });
});
