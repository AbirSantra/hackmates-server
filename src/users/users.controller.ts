import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { CreateUserDto, createUserSchema } from './dto/createUser.dto';

@Controller('users')
export class UsersController {
  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  createUser(@Body() body: CreateUserDto) {
    return body;
  }
}
