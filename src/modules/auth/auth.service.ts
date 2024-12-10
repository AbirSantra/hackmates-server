import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { eq, is } from 'drizzle-orm';
import { user } from 'src/drizzle/schemas';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(registerUserData: RegisterUserDTO) {
    const { email, password } = registerUserData;

    // Check if user with same email already exists
    const existingUser = await this.db.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(password);

    // Insert user into database
    const [newUser] = await this.db
      .insert(user)
      .values({
        email: email,
        password: hashedPassword,
      })
      .returning({
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        bio: user.bio,
        avatar: user.avatar,
      });

    // Generate tokens
    const accessToken = this.tokenService.createAccessToken({
      id: newUser.id,
      email: newUser.email,
    });

    const refreshToken = this.tokenService.createRefreshToken({
      id: newUser.id,
    });

    return {
      user: newUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
