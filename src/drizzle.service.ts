import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './drizzle/schema';

@Injectable()
export class DrizzleService implements OnModuleInit {
      private pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      db = drizzle(this.pool, { schema });

      async onModuleInit() {
        await this.pool.connect();
      }
}
