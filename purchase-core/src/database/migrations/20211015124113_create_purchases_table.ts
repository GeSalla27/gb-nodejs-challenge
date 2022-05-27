import { Knex } from "knex";
import { PURCHASES_TABLE } from "../../constants";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    PURCHASES_TABLE,
    (table: Knex.CreateTableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.text("code").notNullable();
      table.decimal("value").notNullable();
      table.timestamp("date").notNullable();
      table.text("cpf").notNullable();
      table.text("user_id").notNullable();
      table.text("status").notNullable();
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(PURCHASES_TABLE);
}
