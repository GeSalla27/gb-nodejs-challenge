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
import { UserIntegration } from "../user.integration";
import { UserInputSchemaHelper } from "./helpers/user-input.schema.helper";
import { UserResponseSchemaHelper } from "./helpers/user-response.schema.helper";

describe("UserIntegration", () => {
  const httpService = sinon.createStubInstance(HttpService);
  const baseUrl = `${env.USER_CORE_URL}/users`;

  let userIntegration: UserIntegration;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserIntegration,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    userIntegration = module.get<UserIntegration>(UserIntegration);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe("create", () => {
    it("Should create user integration", async () => {
      const userInputSchemaHelper = UserInputSchemaHelper.createPlain();
      const userResponseSchemaHelper = UserResponseSchemaHelper.createPlain();
      const response = AxiosTestHelper.createAxiosResponse(
        HttpStatus.CREATED,
        userResponseSchemaHelper
      );

      httpService.post
        .withArgs(baseUrl, userInputSchemaHelper)
        .returns(of(response));

      await userIntegration.create(userInputSchemaHelper);

      sinon.assert.calledWith(httpService.post, baseUrl, userInputSchemaHelper);
    });
  });

  it.each([
    { status: HttpStatus.CONFLICT },
    { status: HttpStatus.UNPROCESSABLE_ENTITY },
    undefined,
  ])(
    "Should throw exception if create user integration returns erros",
    async (response) => {
      const userInputSchemaHelper = UserInputSchemaHelper.createPlain();
      const expectedError = {
        response,
        isAxiosError: true,
      };

      httpService.post
        .withArgs(baseUrl, userInputSchemaHelper)
        .throws(expectedError);

      try {
        await userIntegration.create(userInputSchemaHelper);
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
});
