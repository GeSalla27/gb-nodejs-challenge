import { token } from "../../../helpers/test/jwt-token.mock";

const authorization = `Bearer ${token}`;

const authHeaders = { Authorization: authorization };

export { authHeaders };
