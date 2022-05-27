import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { AuthIntegration } from "../auth.integration";
import { AuthService } from "../auth.service";
import { IntrospectInputSchemaHelper } from "./helpers/introspect-input.schema.helper";
import { LoginInputSchemaHelper } from "./helpers/login-input.schema.helper";
import { UserLoginResponseSchemaHelper } from "./helpers/login-response.schema";

describe("AuthService", () => {
  const logger = sinon.stub(winston.createLogger());
  const authIntegration = sinon.createStubInstance(AuthIntegration);
  let authService: AuthService;

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
        AuthService,
        { provide: AuthIntegration, useValue: authIntegration },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe("login", () => {
    it("Should login user", async () => {
      const loginInputSchemaHelper = LoginInputSchemaHelper.createPlain();
      const userLoginResponseSchemaHelper =
        UserLoginResponseSchemaHelper.createPlain();

      authIntegration.login
        .withArgs(loginInputSchemaHelper)
        .resolves(userLoginResponseSchemaHelper);

      const loginResponse = await authService.login(loginInputSchemaHelper);

      assert.deepEqual(loginResponse, userLoginResponseSchemaHelper);

      sinon.assert.calledOnceWithExactly(
        authIntegration.login,
        loginInputSchemaHelper
      );
    });
  });

  describe("introspect", () => {
    it("Should introspect user", async () => {
      const introspectInputSchemaHelper =
        IntrospectInputSchemaHelper.createPlain();

      authIntegration.introspect.withArgs(introspectInputSchemaHelper);

      await authService.introspect(introspectInputSchemaHelper);

      sinon.assert.calledOnceWithExactly(
        authIntegration.introspect,
        introspectInputSchemaHelper
      );
    });
  });
});
