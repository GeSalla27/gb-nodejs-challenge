import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { UserIntegration } from "../user.integration";
import { UserService } from "../user.service";
import { UserInputSchemaHelper } from "./helpers/user-input.schema.helper";
import { UserResponseSchemaHelper } from "./helpers/user-response.schema.helper";

describe("UserService", () => {
  const logger = sinon.stub(winston.createLogger());
  const userIntegration = sinon.createStubInstance(UserIntegration);
  let userService: UserService;

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
        UserService,
        { provide: UserIntegration, useValue: userIntegration },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe("create", () => {
    it("Should create user", async () => {
      const userInputSchemaHelper = UserInputSchemaHelper.createPlain();
      const userResponseSchemaHelper = UserResponseSchemaHelper.createPlain();

      userIntegration.create
        .withArgs(userInputSchemaHelper)
        .resolves(userResponseSchemaHelper);

      const userResponse = await userService.create(userInputSchemaHelper);

      assert.deepEqual(userResponse, userResponseSchemaHelper);

      sinon.assert.calledOnceWithExactly(
        userIntegration.create,
        userInputSchemaHelper
      );
    });
  });
});
