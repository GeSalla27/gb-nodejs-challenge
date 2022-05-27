import { TransformPlainToClass } from "@nestjs/class-transformer";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { UserInputSchema } from "./schemas/user-input.schema";
import { UserResponseSchema } from "./schemas/user-response.schema";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post("")
  @HttpCode(HttpStatus.CREATED)
  @TransformPlainToClass(UserResponseSchema)
  async createUser(@Body() user: UserInputSchema): Promise<UserResponseSchema> {
    return this.userService.create(user);
  }
}
