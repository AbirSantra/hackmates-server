import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { user } from 'src/drizzle/schemas';
import { DrizzleDB } from 'src/drizzle/types/drizzle';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async getAllUsers() {
    return this.db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        bio: user.bio,
        avatar: user.avatar,
      })
      .from(user);
  }
}
