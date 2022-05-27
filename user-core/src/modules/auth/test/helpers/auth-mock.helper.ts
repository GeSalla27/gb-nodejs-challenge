import { JwtService } from "@nestjs/jwt";
import { SinonStubbedInstance } from "sinon";
import { AuthenticatedUserSchemaHelper } from "./auth-user.schema.helper";

const mockAuthFlow = (jwtService: SinonStubbedInstance<JwtService>): void => {
  jwtService.decode.returns(AuthenticatedUserSchemaHelper.createClass());
};

export { mockAuthFlow };
