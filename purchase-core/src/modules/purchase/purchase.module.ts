import { Module } from "@nestjs/common";
import { PurchaseController } from "./purchase.controller";
import { PurchaseRepository } from "./purchase.repository";
import { PurchaseService } from "./purchase.service";

@Module({
  imports: [],
  providers: [PurchaseService, PurchaseRepository],
  controllers: [PurchaseController],
  exports: [PurchaseService],
})
export class PurchaseModule {}
