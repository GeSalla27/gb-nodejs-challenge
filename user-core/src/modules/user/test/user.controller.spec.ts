import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as request from "supertest";
import * as winston from "winston";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { IdSchemaHelper } from "./helpers/id.schema.helper";
import { UserInputSchemaHelper } from "./helpers/user-input.schema.helper";
import { UserListQuerySchemaHelper } from "./helpers/user-list-query.schema.helper";
import { UserUpdateSchemaHelper } from "./helpers/user-update.schema.helper";
import { UserEntityHelper } from "./helpers/user.entity.helper";

describe("User controller", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchFields = (actual: any, expected: any): void => {
    assert.equal(actual.id, expected.id);
    assert.equal(actual.first_name, expected.first_name);
    assert.equal(actual.last_name, expected.last_name);
    assert.equal(actual.email, expected.email);
  };

  const userService = sinon.createStubInstance(UserService);
  const logger = sinon.stub(winston.createLogger());

  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
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

  describe("When should be finded users", () => {
    it("Should find user with id", async () => {
      const idSchema = IdSchemaHelper.createClass();

      return request(app.getHttpServer())
        .head(`/users/${idSchema.id}`)
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          sinon.assert.calledOnceWithExactly(
            userService.findOneOrFail,
            idSchema.id
          );
        });
    });

    it("Should find all users", async () => {
      const user = UserEntityHelper.createClass();
      const expected = [user];

      userService.find.resolves(expected);

      return request(app.getHttpServer())
        .get("/users")
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          const { body } = response;

          assert.isArray(body);
          assert.lengthOf(body, 1);

          const resultUser = body[0];

          sinon.assert.calledWith(userService.find);

          matchFields(resultUser, user);
        });
    });

    it("Should find user with filter", async () => {
      const user = UserEntityHelper.createClass();
      const userListQuerySchema = UserListQuerySchemaHelper.createClass();
      const expected = [user];

      userService.find
        .withArgs(sinon.match(userListQuerySchema))
        .resolves(expected);

      return request(app.getHttpServer())
        .get("/users")
        .query(userListQuerySchema)
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          const { body } = response;

          assert.isArray(body);
          assert.lengthOf(body, 1);

          const resultUser = body[0];

          sinon.assert.calledWith(
            userService.find,
            sinon.match(userListQuerySchema)
          );

          matchFields(resultUser, user);
        });
    });

    it("Should not retrieve user and throw not found error", async () => {
      const idSchema = IdSchemaHelper.createClass();

      userService.findOneOrFail.throws(new NotFoundException());

      return request(app.getHttpServer())
        .get(`/users/${idSchema.id}`)
        .then((response) => {
          assert.equal(response.status, HttpStatus.NOT_FOUND);
          assert.equal(response.body.statusCode, HttpStatus.NOT_FOUND);
          assert.equal(response.body.message, "Not Found");
          assert.isDefined(response.body.message);

          sinon.assert.calledOnceWithExactly(
            userService.findOneOrFail,
            idSchema.id
          );
        });
    });
  });

  describe("When should be created users", () => {
    it("Should create user", async () => {
      const user = UserEntityHelper.createClass();
      const userInputSchema = UserInputSchemaHelper.createClass();

      userService.create.resolves(user);

      return request(app.getHttpServer())
        .post("/users")
        .send(userInputSchema)
        .then((response) => {
          assert.equal(response.status, HttpStatus.CREATED);

          const { body } = response;

          sinon.assert.calledWith(
            userService.create,
            sinon.match(userInputSchema)
          );

          matchFields(body, user);
        });
    });

    it("Should not create user and throw unprocessable entity error", async () => {
      userService.create.throws(new UnprocessableEntityException());

      return request(app.getHttpServer())
        .post("/users")
        .send({})
        .then((response) => {
          assert.equal(response.status, HttpStatus.UNPROCESSABLE_ENTITY);
          assert.equal(
            response.body.statusCode,
            HttpStatus.UNPROCESSABLE_ENTITY
          );
          assert.equal(response.body.message, "Unprocessable Entity");
        });
    });
  });

  describe("When should be updated users", () => {
    it("Should update user", async () => {
      const user = UserEntityHelper.createClass();
      const idSchema = IdSchemaHelper.createClass();
      const userUpdateSchema = UserUpdateSchemaHelper.createClass();

      userService.update
        .withArgs(idSchema.id, sinon.match(userUpdateSchema))
        .resolves(user);

      const { status, body } = await request(app.getHttpServer())
        .patch(`/users/${idSchema.id}`)
        .send(userUpdateSchema);

      assert.strictEqual(status, HttpStatus.OK);

      sinon.assert.calledWith(
        userService.update,
        idSchema.id,
        sinon.match(userUpdateSchema)
      );

      matchFields(body, user);
    });
  });

  describe("When should be deleted users", () => {
    it("Should delete user", async () => {
      const idSchema = IdSchemaHelper.createClass();

      userService.remove.resolves();

      return request(app.getHttpServer())
        .delete(`/users/${idSchema.id}`)
        .then((response) => {
          assert.equal(response.status, HttpStatus.NO_CONTENT);
          assert.isObject(response.body);
          assert.isEmpty(response.body);

          sinon.assert.calledOnceWithExactly(userService.remove, idSchema.id);
        });
    });
  });
});
