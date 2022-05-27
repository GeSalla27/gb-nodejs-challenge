import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthIntegration } from "./auth.integration";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthIntegration, AuthService],
  imports: [HttpModule, JwtModule.register({})],
})
export class AuthModule {}
