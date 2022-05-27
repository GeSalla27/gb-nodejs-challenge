import { Module, ValidationPipe } from "@nestjs/common";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { WinstonModule } from "nest-winston";
import winstonConfig from "./config/winston/winston.config";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtGuard } from "./modules/auth/jwt.guard";
import { PurchaseModule } from "./modules/purchase/purchase.module";
import { UsersModule } from "./modules/user/user.module";

@Module({
  imports: [
    AuthModule,
    JwtModule.register({}),
    PurchaseModule,
    UsersModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({}) },
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule {}
