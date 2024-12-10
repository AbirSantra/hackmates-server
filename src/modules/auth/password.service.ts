import { Injectable } from '@nestjs/common';
import * as bycrpt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    const SALT_ROUNDS = 10;
    return bycrpt.hash(password, SALT_ROUNDS);
  }
}
