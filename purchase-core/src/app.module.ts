import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import winstonConfig from "./config/winston/winston.config";
import { KNEX_TOKEN } from "./constants";
import knexConfig from "./database/knexfile";
import { KnexModule } from "./modules/knex/knex.module";
import { PurchaseModule } from "./modules/purchase/purchase.module";

@Module({
  imports: [
    KnexModule.forRoot(KNEX_TOKEN, knexConfig),
    PurchaseModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [],
  providers: [{ provide: APP_PIPE, useValue: new ValidationPipe({}) }],
})
export class AppModule {}
