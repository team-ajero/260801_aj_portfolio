import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

// drizzle-orm 1.0 부터 drizzle(pool, config) 2-argument 형태가 사라지고
// 단일 옵션 객체({ client, ... })를 받는 형태로 바뀌었다.
// (schema는 db.query 관계형 API에서만 쓰이는데 이 프로젝트는 select/insert 빌더만 사용하므로 넘기지 않음)
export const db = drizzle({ client: pool });
