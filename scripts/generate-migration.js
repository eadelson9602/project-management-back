#!/usr/bin/env node

require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

// Get the migration name from command line arguments
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Error: Migration name is required');
  console.log('Usage: yarn generate-migration <migration-name>');
  console.log('Example: yarn generate-migration add_user_fields');
  process.exit(1);
}

// Construct the full path for the migration file (without .ts extension as TypeORM adds it automatically)
const migrationPath = `./src/migrations/${migrationName}`;

try {
  // Execute the TypeORM migration generate command
  const command = `yarn typeorm migration:generate ${migrationPath} -d ./typeorm.config.ts`;

  console.log(`🔄 Generating migration: ${migrationName}`);
  execSync(command, { stdio: 'inherit' });

  console.log(`✅ Migration generated successfully: ${migrationName}`);
} catch (error) {
  console.error('❌ Error generating migration:', error.message);
  process.exit(1);
}
