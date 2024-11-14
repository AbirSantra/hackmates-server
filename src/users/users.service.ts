import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { CreateUserDto } from './dto/createUser.dto';
import { user } from 'src/drizzle/schemas';
import { eq } from 'drizzle-orm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    // Find if user with email already exists
    const existingUser = await this.db.query.user.findFirst({
      where: eq(user.email, email),
    });

    console.log('Existing user: ', existingUser);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    let hashedPassword: string;
    try {
      hashedPassword = await this.hashPassword(password);
    } catch (error) {
      throw new InternalServerErrorException('Error hashing password');
    }

    // Create user
    try {
      const newUser = await this.db
        .insert(user)
        .values({
          email: email,
          name: name,
          password: hashedPassword,
        })
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
        });
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating user in the database',
      );
    }
  }

  private async hashPassword(password: string) {
    const SALT_ROUNDS = 10;
    return hash(password, SALT_ROUNDS);
  }
}
