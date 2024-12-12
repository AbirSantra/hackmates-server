import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports: [DrizzleModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
