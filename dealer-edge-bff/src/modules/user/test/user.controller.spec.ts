import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import * as sinon from "sinon";
import * as request from "supertest";
import { UserController } from "../user-controller";
import { UserService } from "../user.service";
import { UserInputSchemaHelper } from "./helpers/user-input.schema.helper";
import { UserResponseSchemaHelper } from "./helpers/user-response.schema.helper";

describe("UserController", () => {
  const userService = sinon.createStubInstance(UserService);

  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
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

  describe("createUser", () => {
    it("Should create user", async () => {
      const userInputSchemaHelper = UserInputSchemaHelper.createPlain();
      const userResponseSchemaHelper = UserResponseSchemaHelper.createPlain();

      userService.create
        .withArgs(sinon.match(userInputSchemaHelper))
        .resolves(userResponseSchemaHelper);

      return request(app.getHttpServer())
        .post("/users")
        .send(userInputSchemaHelper)
        .then((response) => {
          assert.equal(response.status, HttpStatus.CREATED);

          sinon.assert.calledOnceWithExactly(
            userService.create,
            sinon.match(userInputSchemaHelper)
          );

          assert.deepEqual(response.body, userResponseSchemaHelper);
        });
    });
  });
});
