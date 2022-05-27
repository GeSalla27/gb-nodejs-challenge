import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsJWT, IsNotEmpty, IsString } from "@nestjs/class-validator";

@Exclude()
export class IntrospectInputSchema {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  access_token: string;
}
