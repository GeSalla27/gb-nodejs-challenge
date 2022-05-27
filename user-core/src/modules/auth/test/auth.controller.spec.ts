import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import "reflect-metadata";
import * as sinon from "sinon";
import * as request from "supertest";
import * as winston from "winston";
import { UserLoginSchemaHelper } from "../../user/test/helpers/user-login.schema.helper";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { IntrospectInputSchemaHelper } from "./helpers/introspect-input.schema.helper";
import { UserLoginResponseSchemaHelper } from "./helpers/login-response.schema.helper";

describe("AuthController", () => {
  const logger = sinon.stub(winston.createLogger());
  const authService = sinon.createStubInstance(AuthService);
  const jwtService = sinon.createStubInstance(JwtService);

  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: JwtService, useValue: jwtService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: logger },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector))
    );

    await app.init();
  });

  afterEach(() => {
    sinon.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should login user", async () => {
    const data = UserLoginSchemaHelper.createPlain();
    const result = UserLoginResponseSchemaHelper.createPlain();

    authService.login.withArgs(sinon.match(data)).resolves(result);

    return request(app.getHttpServer())
      .post("/auth/login")
      .send(data)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        sinon.assert.calledOnceWithExactly(
          authService.login,
          sinon.match(data)
        );

        assert.deepEqual(response.body, result);
      });
  });

  it("Should introspect user", async () => {
    const data = IntrospectInputSchemaHelper.createPlain();

    authService.introspect.withArgs(sinon.match(data)).resolves();

    return request(app.getHttpServer())
      .post("/auth/introspect")
      .send(data)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        sinon.assert.calledOnceWithExactly(
          authService.introspect,
          sinon.match(data)
        );
      });
  });
});
