import { HttpService } from "@nestjs/axios";
import {
  HttpStatus,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { of } from "rxjs";
import * as sinon from "sinon";
import env from "../../../app.env";
import { AxiosTestHelper } from "../../helpers/axios-test.helper";
import { AuthIntegration } from "../auth.integration";
import { IntrospectInputSchemaHelper } from "./helpers/introspect-input.schema.helper";
import { LoginInputSchemaHelper } from "./helpers/login-input.schema.helper";
import { UserLoginResponseSchemaHelper } from "./helpers/login-response.schema";

describe("UserIntegration", () => {
  const httpService = sinon.createStubInstance(HttpService);
  const baseUrl = `${env.USER_CORE_URL}/auth`;

  let authIntegration: AuthIntegration;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthIntegration,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    authIntegration = module.get<AuthIntegration>(AuthIntegration);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe("login", () => {
    it("Should login user integration", async () => {
      const loginInputSchemaHelper = LoginInputSchemaHelper.createClass();
      const userLoginResponseSchemaHelper =
        UserLoginResponseSchemaHelper.createClass();
      const url = `${baseUrl}/login`;
      const response = AxiosTestHelper.createAxiosResponse(
        HttpStatus.OK,
        userLoginResponseSchemaHelper
      );

      httpService.post
        .withArgs(url, loginInputSchemaHelper)
        .returns(of(response));

      await authIntegration.login(loginInputSchemaHelper);

      sinon.assert.calledWith(httpService.post, url, loginInputSchemaHelper);
    });

    it.each([
      { status: HttpStatus.UNAUTHORIZED },
      { status: HttpStatus.UNPROCESSABLE_ENTITY },
      undefined,
    ])(
      "Should throw exception if login user integration returns erros",
      async (response) => {
        const loginInputSchemaHelper = LoginInputSchemaHelper.createClass();
        const url = `${baseUrl}/login`;
        const expectedError = {
          response,
          isAxiosError: true,
        };

        httpService.post
          .withArgs(url, loginInputSchemaHelper)
          .throws(expectedError);

        try {
          await authIntegration.login(loginInputSchemaHelper);
        } catch (error) {
          if (expectedError.response?.status === HttpStatus.UNAUTHORIZED) {
            assert.instanceOf(error, UnauthorizedException);
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

  describe("introspect", () => {
    it("Should introspect user integration", async () => {
      const introspectInputSchemaHelper =
        IntrospectInputSchemaHelper.createClass();
      const url = `${baseUrl}/introspect`;
      const response = AxiosTestHelper.createAxiosResponse(HttpStatus.OK);

      httpService.post
        .withArgs(url, introspectInputSchemaHelper)
        .returns(of(response));

      await authIntegration.introspect(introspectInputSchemaHelper);

      sinon.assert.calledWith(
        httpService.post,
        url,
        introspectInputSchemaHelper
      );
    });
  });
});
