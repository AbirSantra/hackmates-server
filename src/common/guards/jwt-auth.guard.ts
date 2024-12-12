import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { user } from 'src/drizzle/schemas';
import { DrizzleDB } from 'src/drizzle/types/drizzle';

export interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly db: DrizzleDB,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = await this.validateToken(accessToken);

      request['user'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Session expired!');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(token: string): Promise<JwtPayload> {
    // Verify token signature
    const payload = this.jwtService.verify<JwtPayload>(token);

    const existingUser = await this.db.query.user.findFirst({
      where: eq(user.id, Number(payload.id)),
    });

    if (!existingUser) {
      throw new HttpException('Invalid Credentials', 420);
    }

    return payload;
  }
}
