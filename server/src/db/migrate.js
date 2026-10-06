import fs from 'fs';
import path from 'path';
import fileUrl from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables
dotenv.config();

const __filename = fileUrl.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('🚀 Starting Supabase Database Migration Runner...\n');

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '';

  // Locate migrations folder
  const migrationsDir = path.resolve(__dirname, '../../../supabase/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Migrations directory not found at: ${migrationsDir}`);
    process.exit(1);
  }

  // Get list of migration SQL files
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('⚠️ No SQL migration files found in supabase/migrations.');
    return;
  }

  console.log(`📁 Found ${migrationFiles.length} migration file(s):`);
  migrationFiles.forEach((file) => console.log(`   - ${file}`));
  console.log('');

  // Strategy 1: Direct PostgreSQL Connection String (DATABASE_URL / SUPABASE_DB_URL)
  if (dbUrl && dbUrl !== 'placeholder-db-url') {
    console.log('🔌 Connecting to Supabase PostgreSQL using connection string...');
    const client = new pg.Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }, // Required for Supabase cloud DB connection
    });

    try {
      await client.connect();
      console.log('✅ Connected to PostgreSQL database.');

      for (const file of migrationFiles) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`⏳ Applying migration: ${file}...`);
        await client.query(sql);
        console.log(`✅ Applied migration: ${file}`);
      }

      console.log('\n🎉 All database migrations applied successfully!');
      await client.end();
      return;
    } catch (err) {
      console.error(`❌ Migration execution failed via PostgreSQL connection:`, err.message);
      await client.end();
      process.exit(1);
    }
  }

  // Strategy 2: Supabase Management API via Service Role Key / REST
  if (serviceRoleKey && serviceRoleKey !== 'placeholder-service-role-key' && supabaseUrl) {
    console.log('🔑 SUPABASE_SERVICE_ROLE_KEY detected.');

    // Extract project ref from URL if possible (e.g., https://xyz.supabase.co -> xyz)
    const refMatch = supabaseUrl.match(/https:\/\/([a-z0-9-]+)\.supabase\.co/);
    const projectRef = refMatch ? refMatch[1] : null;

    if (projectRef) {
      console.log(`🌐 Attempting SQL execution on Supabase Project [${projectRef}] via Management API...`);
      try {
        for (const file of migrationFiles) {
          const filePath = path.join(migrationsDir, file);
          const sql = fs.readFileSync(filePath, 'utf8');

          console.log(`⏳ Applying migration: ${file}...`);
          
          const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/db/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify({ query: sql }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Supabase API responded with status ${response.status}: ${errorText}`);
          }

          console.log(`✅ Applied migration: ${file}`);
        }

        console.log('\n🎉 All database migrations applied successfully via Supabase Management API!');
        return;
      } catch (apiErr) {
        console.warn(`⚠️ Management API execution attempt failed: ${apiErr.message}`);
        console.log('ℹ️ Falling back to connection string instructions...\n');
      }
    }
  }

  // If credentials are placeholder or missing
  console.log('----------------------------------------------------------------------');
  console.log('⚠️  NO VALID DATABASE CONNECTION STRING OR SERVICE KEY DETECTED');
  console.log('----------------------------------------------------------------------');
  console.log('To run migrations automatically from Node.js, please set one of the following in server/.env:\n');
  console.log('1. DATABASE_URL (Recommended for PostgreSQL direct connection):');
  console.log('   DATABASE_URL=postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres\n');
  console.log('2. SUPABASE_SERVICE_ROLE_KEY & SUPABASE_URL:');
  console.log('   SUPABASE_URL=https://[your-project-ref].supabase.co');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=[your-supabase-service-role-key]\n');
  console.log('Alternative (Manual SQL Execution):');
  console.log('   Open Supabase Dashboard -> SQL Editor -> New Query');
  console.log(`   Paste the contents of: supabase/migrations/001_intial_schema.sql`);
  console.log('   Click "Run"\n');
}

runMigrations().catch((err) => {
  console.error('❌ Migration runner fatal error:', err);
  process.exit(1);
});
