import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schemas/index';

export type DrizzleDB = NodePgDatabase<typeof schema>;
