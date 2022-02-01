psql --dbname $DATABASE_URL < scripts/db_init.sql
echo "Migration script executed"