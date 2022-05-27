import * as dotenv from "dotenv";

dotenv.config();

const env = {
  BASE_PATH: (process.env.BASE_PATH ?? "") as string,
  LOG_CONSOLE_LEVEL: process.env.LOG_CONSOLE_LEVEL as string,
  LOG_FILE_ACTIVE: process.env.LOG_FILE_ACTIVE === "true",
  LOG_FILE_LEVEL: process.env.LOG_FILE_LEVEL as string,
  LOG_FILE_NAME: process.env.LOG_FILE_NAME as string,
  PURCHASE_CORE_URL: process.env.PURCHASE_CORE_URL as string,
  USER_CORE_URL: process.env.USER_CORE_URL as string,
};

export default Object.freeze(env);
