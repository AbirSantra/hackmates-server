import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';

@Module({
  imports: [DrizzleModule],
  providers: [AuthService, PasswordService, TokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
