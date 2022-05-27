import { Knex } from "knex";
import { USERS_TABLE } from "../../constants";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    USERS_TABLE,
    (table: Knex.CreateTableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.text("full_name").notNullable();
      table.text("cpf").notNullable();
      table.text("email").notNullable();
      table.text("password").notNullable();

      table.unique(["email"], { indexName: "email" });
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(USERS_TABLE);
}
