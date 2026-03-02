import pg from "pg";

const { Pool } = pg;

async function runCleanup() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("No DATABASE_URL set, skipping cleanup");
    return;
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    const migrationCheck = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_schema_migrations') as exists`
    );
    if (!migrationCheck.rows[0].exists) {
      await client.query(`CREATE TABLE _schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMP DEFAULT NOW())`);
    }

    const alreadyRan = await client.query(
      `SELECT 1 FROM _schema_migrations WHERE id = 'cleanup_orphaned_v2'`
    );
    if (alreadyRan.rows.length > 0) {
      console.log("[db-cleanup] Already applied, skipping");
      return;
    }

    console.log("[db-cleanup] Running schema cleanup...");
    await client.query('BEGIN');

    const fksToRemove = [
      { table: 'projects', constraint: 'projects_template_id_templates_id_fk' },
      { table: 'add_on_selections', constraint: 'add_on_selections_project_id_projects_id_fk' },
      { table: 'assignments', constraint: 'assignments_add_on_selection_id_add_on_selections_id_fk' },
      { table: 'assignments', constraint: 'assignments_specialist_user_id_users_id_fk' },
      { table: 'audit_logs', constraint: 'audit_logs_actor_user_id_users_id_fk' },
      { table: 'blog_posts', constraint: 'blog_posts_author_id_users_id_fk' },
      { table: 'reports', constraint: 'reports_created_by_user_id_users_id_fk' },
      { table: 'reports', constraint: 'reports_project_id_projects_id_fk' },
      { table: 'specialist_profiles', constraint: 'specialist_profiles_user_id_users_id_fk' },
    ];
    for (const { table, constraint } of fksToRemove) {
      await client.query(`ALTER TABLE IF EXISTS "${table}" DROP CONSTRAINT IF EXISTS "${constraint}"`);
    }

    const orphanedTables = [
      'assignments', 'audit_logs', 'blog_posts', 'reports',
      'specialist_profiles', 'system_config', 'templates'
    ];
    for (const table of orphanedTables) {
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }

    const projectExtraCols = [
      'template_id', 'public_url', 'showcase_opt_in', 'showcase_thumbnail_url',
      'showcase_title', 'showcase_description', 'showcase_industry',
      'showcase_featured', 'launched_at'
    ];
    for (const col of projectExtraCols) {
      await client.query(`ALTER TABLE projects DROP COLUMN IF EXISTS "${col}"`);
    }
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "company_name" text`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "onboarding_completed" boolean DEFAULT false`);

    const plansExtraCols = ['included_templates_min', 'included_templates_max', 'included_credits', 'sla_text'];
    for (const col of plansExtraCols) {
      await client.query(`ALTER TABLE plans DROP COLUMN IF EXISTS "${col}"`);
    }

    await client.query(`ALTER TABLE add_on_selections DROP COLUMN IF EXISTS "project_id"`);

    await client.query(`ALTER TABLE users ALTER COLUMN role TYPE text`);
    await client.query(`UPDATE users SET role = 'CUSTOMER' WHERE role NOT IN ('ADMIN', 'CUSTOMER')`);

    await client.query(`ALTER TABLE subscriptions ALTER COLUMN status TYPE text`);
    await client.query(`UPDATE subscriptions SET status = 'ACTIVE' WHERE status IN ('active', 'trialing')`);
    await client.query(`UPDATE subscriptions SET status = 'PAST_DUE' WHERE status IN ('past_due', 'unpaid')`);
    await client.query(`UPDATE subscriptions SET status = 'CANCELED' WHERE status IN ('canceled', 'incomplete_expired', 'paused')`);
    await client.query(`UPDATE subscriptions SET status = 'INCOMPLETE' WHERE status IN ('incomplete')`);

    const orphanedEnums = ['assignment_status', 'blog_status', 'showcase_opt_in'];
    for (const enumType of orphanedEnums) {
      await client.query(`DROP TYPE IF EXISTS "${enumType}" CASCADE`);
    }

    const enumCleanups = [
      { name: 'user_role', validValues: ['ADMIN', 'CUSTOMER'], column: 'role', table: 'users' },
      { name: 'subscription_status', validValues: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE'], column: 'status', table: 'subscriptions' }
    ];

    for (const { name, validValues, column, table } of enumCleanups) {
      await client.query(`DROP TYPE IF EXISTS "${name}" CASCADE`);
      const valuesStr = validValues.map(v => `'${v}'`).join(', ');
      await client.query(`CREATE TYPE "${name}" AS ENUM (${valuesStr})`);
      await client.query(`ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE "${name}" USING "${column}"::"${name}"`);
    }

    await client.query(`DELETE FROM _schema_migrations WHERE id = 'cleanup_orphaned_v1'`);
    await client.query(`INSERT INTO _schema_migrations (id) VALUES ('cleanup_orphaned_v2')`);
    await client.query('COMMIT');
    console.log("[db-cleanup] Schema cleanup completed");
  } catch (error: any) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(`[db-cleanup] Failed, rolled back: ${error.message}`);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runCleanup().catch((err) => {
  console.error(err);
  process.exit(1);
});
