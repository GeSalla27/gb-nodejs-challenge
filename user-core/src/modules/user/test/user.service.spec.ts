import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { assert } from "chai";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { UserRepository } from "../user.repository";
import { UserService } from "../user.service";
import { UserInputSchemaHelper } from "./helpers/user-input.schema.helper";
import { UserUpdateSchemaHelper } from "./helpers/user-update.schema.helper";
import { UserEntityHelper } from "./helpers/user.entity.helper";

describe("User service", () => {
  const userRepository = sinon.createStubInstance(UserRepository);
  const logger = sinon.stub(winston.createLogger());

  let userService: UserService;

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    sinon.reset();
    await module.close();
  });

  describe("When should be finded users", () => {
    it("Should find a user", async () => {
      const user = UserEntityHelper.createClass();

      userRepository.findOne.withArgs(sinon.match(user.id)).resolves(user);

      const result = await userService.findOne(user.id);

      assert.deepEqual(result, user);

      sinon.assert.calledOnceWithExactly(
        userRepository.findOne,
        sinon.match(user.id)
      );
    });

    it("Should not find a user and fail with NotFoundException", async () => {
      const user = UserEntityHelper.createClass();

      userRepository.findOne.withArgs(sinon.match(user.id)).resolves(undefined);

      try {
        await userService.findOneOrFail(user.id);
      } catch (e) {
        assert.instanceOf(e, NotFoundException);
        sinon.assert.calledOnceWithExactly(
          userRepository.findOne,
          sinon.match(user.id)
        );
        return;
      }

      throw new Error("Expected exception to be thrown, but was not");
    });

    it("Should find all user by email", async () => {
      const user = UserEntityHelper.createClass();

      userRepository.find
        .withArgs(sinon.match({ email: user.email }))
        .resolves([user]);

      const result = await userService.find({ email: user.email });

      assert.deepEqual(result, [user]);

      sinon.assert.calledOnceWithExactly(
        userRepository.find,
        sinon.match({ email: user.email })
      );
    });
  });

  describe("When should be created users", () => {
    it("Should create a user", async () => {
      const userInputSchema = UserInputSchemaHelper.createClass();
      const user = UserEntityHelper.createClass();

      userRepository.save.withArgs(sinon.match(userInputSchema)).resolves(user);

      const result = await userService.create(userInputSchema);

      assert.deepEqual(result, user);

      sinon.assert.calledOnceWithExactly(
        userRepository.save,
        sinon.match(userInputSchema)
      );
    });
  });

  describe("When should be updated users", () => {
    it("Should update a user", async () => {
      const userUpdateSchema = UserUpdateSchemaHelper.createClass();
      const user = UserEntityHelper.createClass();
      userUpdateSchema.email = "gabrielsallaalter@outlook.com";
      const userUpdate = { ...userUpdateSchema, id: user.id };

      userRepository.update.withArgs(sinon.match(userUpdate)).resolves(user);

      userRepository.findOne.withArgs(sinon.match(user.id)).resolves(user);

      const result = await userService.update(user.id, userUpdateSchema);

      assert.deepEqual(result, user);

      sinon.assert.calledOnceWithExactly(
        userRepository.update,
        sinon.match(userUpdate)
      );

      sinon.assert.calledOnceWithExactly(
        userRepository.findOne,
        sinon.match(user.id)
      );
    });
  });

  describe("When should be deleted users", () => {
    it("Should delete a user", async () => {
      const user = UserEntityHelper.createClass();

      userRepository.findOne.withArgs(sinon.match(user.id)).resolves(user);
      userRepository.delete.withArgs(sinon.match(user.id)).resolves();

      await userService.remove(user.id);

      sinon.assert.calledOnceWithExactly(
        userRepository.delete,
        sinon.match(user.id)
      );
    });
  });
});
