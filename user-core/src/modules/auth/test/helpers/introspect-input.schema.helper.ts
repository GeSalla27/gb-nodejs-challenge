import { plainToClass } from "@nestjs/class-transformer";
import { IntrospectInputSchema } from "../../schemas/introspect-input.schema";

export class IntrospectInputSchemaHelper {
  static createPlain(): any {
    return {
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlZHJvZ2Vyb25pbm9Ab3V0bG9vay5jb20iLCJzdWIiOiI5NjY2ODI1Ny03N2VmLTQxNzEtOWY0Ni00NGM1NjU0MzkyOTYiLCJpYXQiOjE2NTIyMDQyNjIsImV4cCI6MTY1MjIwNDMyMn0.g-a8aM8OrwVIDDra18lsWqiV7lctwJy2ZHcuIO0_hx4",
    };
  }

  static createClass(): IntrospectInputSchema {
    return plainToClass(
      IntrospectInputSchema,
      IntrospectInputSchemaHelper.createPlain()
    );
  }
}
