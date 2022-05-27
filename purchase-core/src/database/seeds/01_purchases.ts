import { Knex } from "knex";
import { PURCHASES_TABLE } from "../../constants";
import { StatusEnum } from "../../modules/purchase/enums/status.enum";

export async function seed(knex: Knex): Promise<void> {
  await knex(PURCHASES_TABLE).del();

  await knex(PURCHASES_TABLE).insert([
    {
      id: "723b0a17-f13a-432e-9030-4faf91f73cf1",
      code: "1",
      value: 100,
      date: "2022-05-24T00:00:00.000Z",
      cpf: "03651198066",
      user_id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      status: StatusEnum.APPROVED,
    },
  ]);
}
