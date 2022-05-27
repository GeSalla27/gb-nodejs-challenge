import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import * as sinon from "sinon";
import * as request from "supertest";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { LoginInputSchemaHelper } from "./helpers/login-input.schema.helper";
import { UserLoginResponseSchemaHelper } from "./helpers/login-response.schema";

describe("AuthController", () => {
  const authService = sinon.createStubInstance(AuthService);

  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  afterEach(() => {
    sinon.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("login", () => {
    it("Should login user", async () => {
      const loginInputSchemaHelper = LoginInputSchemaHelper.createPlain();
      const userLoginResponseSchemaHelper =
        UserLoginResponseSchemaHelper.createPlain();

      authService.login
        .withArgs(sinon.match(loginInputSchemaHelper))
        .resolves(userLoginResponseSchemaHelper);

      return request(app.getHttpServer())
        .post("/auth/login")
        .send(loginInputSchemaHelper)
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          sinon.assert.calledOnceWithExactly(
            authService.login,
            sinon.match(loginInputSchemaHelper)
          );

          assert.deepEqual(response.body, userLoginResponseSchemaHelper);
        });
    });
  });
});
