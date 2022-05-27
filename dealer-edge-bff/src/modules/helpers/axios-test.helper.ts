import { HttpStatus } from "@nestjs/common";
import { AxiosResponse } from "axios";

export class AxiosTestHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createAxiosResponse<T = any>(
    status: HttpStatus,
    data: T = {} as T,
    request: unknown = {}
  ): AxiosResponse<T> {
    return {
      data,
      status,
      statusText: "OK",
      headers: {},
      config: {
        url: "http://super-service.com/super-endpoint",
        method: "POST",
      },
      request,
    };
  }
}
