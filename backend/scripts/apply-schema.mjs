import fs from 'node:fs/promises';
import path from 'node:path';
import dns from 'node:dns';
import dotenv from 'dotenv';
import pg from 'pg';
import { fileURLToPath } from 'node:url';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  if (!process.env.SUPABASE_DB_URL) {
    throw new Error('Missing SUPABASE_DB_URL in backend/.env');
  }

  const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
  const schema = await fs.readFile(schemaPath, 'utf8');
  const connectionUrl = new URL(process.env.SUPABASE_DB_URL);
  const resolver = new dns.promises.Resolver();
  resolver.setServers(['8.8.8.8', '1.1.1.1']);
  const ipv6Hosts = await resolver.resolve6(connectionUrl.hostname);

  const client = new Client({
    host: ipv6Hosts[0],
    port: Number(connectionUrl.port || 5432),
    user: decodeURIComponent(connectionUrl.username),
    password: decodeURIComponent(connectionUrl.password),
    database: connectionUrl.pathname.replace(/^\//, '') || 'postgres',
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  await client.query(schema);
  await client.end();

  console.log('Supabase schema applied successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
