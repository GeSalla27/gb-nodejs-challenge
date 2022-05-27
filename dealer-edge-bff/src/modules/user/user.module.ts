import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { UserController } from "./user-controller";
import { UserIntegration } from "./user.integration";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [HttpModule],
  providers: [UserService, UserIntegration],
})
export class UsersModule {}
