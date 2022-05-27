import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX_TOKEN, PURCHASES_TABLE } from "../../constants";
import { PurchaseEntity } from "./entities/purchase.entity";
import { PurchaseUpdateSchema } from "./schemas/purchase-update.schema";
import { PurchaseFilter } from "./types/purchase-filter.type";
import { PurchaseInputType } from "./types/purchase-input.type";

@Injectable()
export class PurchaseRepository {
  constructor(@Inject(KNEX_TOKEN) private readonly knex: Knex) {}

  async exists(filter: PurchaseFilter): Promise<boolean> {
    const query = this.knex<PurchaseEntity>(PURCHASES_TABLE).column(
      this.knex.raw("1 as exists")
    );

    if (filter.id) {
      query.where({ id: filter.id });
    }

    if (filter.code) {
      query.where({ code: filter.code });
    }

    if (filter.cpf) {
      query.where({ cpf: filter.cpf });
    }

    const purchase = await query.first<PurchaseEntity>();

    return !!purchase;
  }

  async find(filter: PurchaseFilter): Promise<PurchaseEntity[]> {
    const query = this.knex<PurchaseEntity>(PURCHASES_TABLE);

    if (filter.id) {
      query.where({ id: filter.id });
    }

    if (filter.code) {
      query.where({ code: filter.code });
    }

    if (filter.cpf) {
      query.where({ cpf: filter.cpf });
    }

    if (filter.user_id) {
      query.where({ user_id: filter.user_id });
    }

    return query;
  }

  async findOne(id: string): Promise<PurchaseEntity | null> {
    const query = this.knex<PurchaseEntity>(PURCHASES_TABLE)
      .select<PurchaseEntity>()
      .where({ id });

    return query.first<PurchaseEntity>();
  }

  async save(values: PurchaseInputType): Promise<PurchaseEntity> {
    const [purchase] = await this.knex<PurchaseEntity>(PURCHASES_TABLE)
      .insert({
        ...values,
      })
      .returning("*");

    return purchase;
  }

  async update(values: PurchaseUpdateSchema): Promise<PurchaseEntity> {
    const [purchase] = await this.knex<PurchaseEntity>(PURCHASES_TABLE)
      .update({
        ...values,
      })
      .where({
        id: values.id,
      })
      .returning("*");

    return purchase;
  }

  async delete(id: string): Promise<void> {
    await this.knex<PurchaseEntity>(PURCHASES_TABLE).delete().where({ id });
  }
}
