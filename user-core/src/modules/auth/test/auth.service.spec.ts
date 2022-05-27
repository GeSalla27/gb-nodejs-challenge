import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { UserEntityHelper } from "../../user/test/helpers/user.entity.helper";
import { UserService } from "../../user/user.service";
import { AuthService } from "../auth.service";
import { IntrospectInputSchemaHelper } from "./helpers/introspect-input.schema.helper";
import { LoginInputSchemaHelper } from "./helpers/login-input.schema.helper";
import { UserLoginResponseSchemaHelper } from "./helpers/login-response.schema.helper";

describe("Auth service", () => {
  const logger = sinon.stub(winston.createLogger());
  const userService = sinon.createStubInstance(UserService);
  const jwtService = sinon.createStubInstance(JwtService);
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: "ILIACHALLENGE_INTERNAL" }),
        {
          module: WinstonModule,
          providers: [{ provide: WINSTON_MODULE_PROVIDER, useValue: logger }],
          exports: [WINSTON_MODULE_PROVIDER],
        },
      ],
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    sinon.reset();
  });

  it("Should login", async () => {
    const userLoginSchemaHelper = LoginInputSchemaHelper.createClass();
    const userLoginResponseSchemaHelper =
      UserLoginResponseSchemaHelper.createClass();
    const userEntityHelper = UserEntityHelper.createClass();

    userService.findUserWithCredentials
      .withArgs({ email: userLoginSchemaHelper.email })
      .resolves([userEntityHelper]);

    const loginResponse = await authService.login(userLoginSchemaHelper);

    sinon.assert.calledWith(userService.findUserWithCredentials, {
      email: userLoginSchemaHelper.email,
    });

    assert.strictEqual(
      loginResponse.user.id,
      userLoginResponseSchemaHelper.user.id
    );
    assert.strictEqual(
      loginResponse.user.email,
      userLoginResponseSchemaHelper.user.email
    );
    assert.strictEqual(
      loginResponse.user.full_name,
      userLoginResponseSchemaHelper.user.full_name
    );
    assert.strictEqual(
      loginResponse.user.cpf,
      userLoginResponseSchemaHelper.user.cpf
    );
  });

  it("Should introspect valid signature", async () => {
    const introspectInputSchemaHelper =
      IntrospectInputSchemaHelper.createClass();

    const userEntityHelper = UserEntityHelper.createClass();
    const userId = "4d13575f-64a1-4fd4-b96b-19a6e354388a";

    jwtService.verify.resolves(introspectInputSchemaHelper);
    userService.findOneOrFail.withArgs(userId).resolves(userEntityHelper);

    await authService.introspect(introspectInputSchemaHelper);
  });

  it("Should introspect and invalid signature", async () => {
    const introspectInputSchemaHelper =
      IntrospectInputSchemaHelper.createClass();

    const userEntityHelper = UserEntityHelper.createClass();
    const userId = "4d13575f-64a1-4fd4-b96b-19a6e354388a";

    userService.findOneOrFail.withArgs(userId).resolves(userEntityHelper);

    try {
      await authService.introspect(introspectInputSchemaHelper);
    } catch (error: any) {
      assert.strictEqual(error.message, "Decoded token is malformed");

      return;
    }

    throw new Error("Expected error, but none found");
  });
});
