import { Test } from "@nestjs/testing";
import { assert } from "chai";
import KnexBuilder, { Knex } from "knex";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { KNEX_TOKEN } from "../../../constants";
import knexConfigs from "../../../database/knexfile";
import { UserEntity } from "../entities/user.entity";
import { UserRepository } from "../user.repository";
import { UserInputSchemaHelper } from "./helpers/user-input.schema.helper";
import { UserEntityHelper } from "./helpers/user.entity.helper";

describe("User repository", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchFields = (actual: any, expected: any): void => {
    assert.equal(actual.id, expected.id);
    assert.equal(actual.first_name, expected.first_name);
    assert.equal(actual.last_name, expected.last_name);
    assert.equal(actual.email, expected.email);
  };

  let userRepository: UserRepository;
  let knex: Knex;
  const logger = sinon.stub(winston.createLogger());

  beforeAll(async () => {
    knex = KnexBuilder(knexConfigs);
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await knex.destroy();
  });

  beforeEach(async () => {
    sinon.reset();

    await knex.seed.run();

    const module = await Test.createTestingModule({
      imports: [
        {
          module: WinstonModule,
          providers: [
            {
              provide: WINSTON_MODULE_PROVIDER,
              useValue: logger,
            },
          ],
          exports: [WINSTON_MODULE_PROVIDER],
        },
      ],
      providers: [
        UserRepository,
        {
          provide: KNEX_TOKEN,
          useValue: knex,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    sinon.reset();
  });

  it("Should find all users", async () => {
    const users = await userRepository.find({});

    assert.lengthOf(users, 1);
  });

  it("Should find a user by id", async () => {
    const user = (await userRepository.findOne(
      "4d13575f-64a1-4fd4-b96b-19a6e354388a"
    )) as UserEntity;

    const userEntity = UserEntityHelper.createClass();

    matchFields(user, userEntity);
  });

  it("Should find user with filters", async () => {
    const [user] = (await userRepository.find({
      email: "gabrielsalla@outlook.com",
    })) as UserEntity[];

    const userEntity = UserEntityHelper.createClass();

    matchFields(user, userEntity);
  });

  it("Should verify if exists a user with filters", async () => {
    const user = await userRepository.exists({
      email: "gabrielsalla@outlook.com",
    });
    assert.isTrue(user);
  });

  it("Should verify if exists a user without filters", async () => {
    const user = await userRepository.exists({});
    assert.isTrue(user);
  });

  it("Should verify if exists a user with id", async () => {
    const user = await userRepository.exists({
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
    });
    assert.isTrue(user);
  });

  it("Should verify if exists a user with name", async () => {
    const user = await userRepository.exists({
      full_name: "Gabriel Salla",
    });
    assert.isTrue(user);
  });

  it("Should create a user", async () => {
    const user = UserInputSchemaHelper.createPlain();
    user.email = "new.e-mail@gmail.com";
    const dbUser = await userRepository.save(user);

    assert.equal(dbUser.full_name, user.full_name);
    assert.equal(dbUser.cpf, user.cpf);
    assert.equal(dbUser.email, user.email);
  });

  it("Should update a user ", async () => {
    const user = {
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      full_name: "New Name",
      cpf: "03651198067",
    };
    const oldValues = (await userRepository.findOne(
      "4d13575f-64a1-4fd4-b96b-19a6e354388a"
    )) as UserEntity;

    const newValues = await userRepository.update(user);

    assert.equal(newValues.full_name, user.full_name);
    assert.equal(newValues.cpf, user.cpf);
    assert.deepEqual(newValues.email, oldValues.email);
  });

  it("Should delete a user by id", async () => {
    await userRepository.delete("4d13575f-64a1-4fd4-b96b-19a6e354388a");

    const user = await userRepository.findOne(
      "4d13575f-64a1-4fd4-b96b-19a6e354388a"
    );

    assert.isUndefined(user);
  });
});
