import { Exclude } from "@nestjs/class-transformer";

export class IntrospectInputSchema {
  @Exclude()
  access_token: string;
}
