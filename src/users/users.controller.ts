import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { CreateUserDto, createUserSchema } from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
}
