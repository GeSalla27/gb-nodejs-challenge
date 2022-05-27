import { JwtService } from "@nestjs/jwt";
import { SinonStubbedInstance } from "sinon";
import { AuthService } from "../../auth/auth.service";
import { AuthUserSchemaHelper } from "../../auth/test/helpers/auth-user.schema.helper";

const mockAuthFlow = (
  jwtService: SinonStubbedInstance<JwtService>,
  authService: SinonStubbedInstance<AuthService>
): void => {
  jwtService.decode.returns(AuthUserSchemaHelper.createClass());
  authService.introspect.resolves();
};

export { mockAuthFlow };
