import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PurchaseController } from "./purchase.controller";
import { PurchaseIntegration } from "./purchase.integration";
import { PurchaseService } from "./purchase.service";

@Module({
  controllers: [PurchaseController],
  exports: [PurchaseService],
  imports: [HttpModule],
  providers: [PurchaseService, PurchaseIntegration],
})
export class PurchaseModule {}
