/**
 * Complete Database Setup Script
 * Creates database and tables for landing backend
 */

require('dotenv').config();
const { Client } = require('pg');

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
};

async function setupDatabase() {
  console.log('\n🔧 Starting database setup...\n');

  // Step 1: Create database
  console.log('Step 1: Creating database...');
  const client = new Client(config);

  try {
    await client.connect();
    console.log('✓ Connected to PostgreSQL server');

    // Check if database exists
    const dbCheckResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME]
    );

    if (dbCheckResult.rows.length === 0) {
      // Create database
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✓ Database '${process.env.DB_NAME}' created successfully`);
    } else {
      console.log(`✓ Database '${process.env.DB_NAME}' already exists`);
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    if (error.code === '28P01') {
      console.error('\n⚠️  Authentication failed!');
      console.error('Please check DB_PASSWORD in .env file');
      console.error(`Current password: ${process.env.DB_PASSWORD}`);
    }
    process.exit(1);
  }

  // Step 2: Create tables
  console.log('\nStep 2: Creating tables...');
  const dbClient = new Client({
    ...config,
    database: process.env.DB_NAME,
  });

  try {
    await dbClient.connect();
    console.log(`✓ Connected to database '${process.env.DB_NAME}'`);

    // Create contacts table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table "contacts" created successfully');

    // Create indexes
    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)
    `);
    console.log('✓ Index "idx_contacts_email" created successfully');

    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC)
    `);
    console.log('✓ Index "idx_contacts_created_at" created successfully');

    // Get table info
    const tableInfo = await dbClient.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'contacts'
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Table structure:');
    console.table(tableInfo.rows);

    await dbClient.end();

    console.log('\n✅ Database setup completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Restart your server: npm start');
    console.log('2. Test the API: npm test');
    console.log('3. Or use Postman to test endpoints\n');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

setupDatabase();
