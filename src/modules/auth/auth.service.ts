import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { eq, is } from 'drizzle-orm';
import { user } from 'src/drizzle/schemas';
import { LoginUserDTO } from './dto/login-user.dto';

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

  async loginUser(loginData: LoginUserDTO) {
    const { email, password } = loginData;

    // Find user by email
    const existingUser = await this.db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!existingUser) {
      throw new BadRequestException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.tokenService.createAccessToken({
      id: existingUser.id,
      email: existingUser.email,
    });

    const refreshToken = this.tokenService.createAccessToken({
      id: existingUser.id,
    });

    return {
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        username: existingUser.username,
        isVerified: existingUser.isVerified,
        isActive: existingUser.isActive,
        createdAt: existingUser.createdAt,
        bio: existingUser.bio,
        avatar: existingUser.avatar,
      },
      accessToken,
      refreshToken,
    };
  }
}
