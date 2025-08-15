## Start the backend

This guide provides the definitive steps to set up and run the backend, ensuring a consistent development environment by using a database backup.

## Recent Updates (August 15, 2025)

🔧 **Database Schema Fix**: Resolved login crashes caused by missing `contractExpiryDate` column in the employee table.
📊 **Updated Backup File**: The `database_backup_pg15_fixed_utf8.sql` now includes the complete schema with all recent improvements.
🚀 **Improved Stability**: Backend now starts reliably without requiring manual database patches.

## Setup Instructions

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Reset and Restore the Database

To guarantee a clean and consistent state, the setup process involves resetting the database and restoring it from the latest backup file.

**Warning:** This process is destructive and will replace your existing local database.

**Step 3.1: Stop Running Containers and Delete Old Data**

```bash
docker compose down && docker volume rm backend_postgres_data
```

**Step 3.2: Start a Fresh Database Container**

```bash
docker compose up -d
```

**Step 3.3: Restore the Database from the Backup File**

Use the latest UTF-8 backup file that includes all schema updates:

```bash
# Use the latest UTF-8 backup file with complete schema
cat database_backup_pg15_fixed_utf8.sql | docker compose exec -T database psql -U admin -d SingleDatabase
```

**Note:** The `database_backup_pg15_fixed_utf8.sql` file contains the most up-to-date database schema including all recent improvements and fixes. This ensures your local development environment matches the production schema exactly.

### 4. Start the Backend Server

With the database restored, start the application server.

```bash
pnpm run start
```

## Start the frontend

### Navigate to it

```bash
cd frontend
```

### Install the node modules (the dependencies)

```bash
pnpm install
```

### Start it

```bash
pnpm run start
```


### Add the .env file in the Backend (Optional)

To run the basic features `.env` file is not required, I've hardcoded everything for now. 
But there might be some unexplored features that might use the environment variables, so if you plan on exploring all features:

Keep this content in the `.env` file.
The `.env` file must be kept as the direct child of `backend/` directory, (In the same level as `src/`)

```txt
secret=dev_secret_key_change_late
HOST=127.0.0.1
USER=admin
PASSWORD=admin
DB=SingleDatabase
DIALECT=postgres
PORT=5432
HTTP_PORT=5000
EMAIL=dev@example.com
EMAIL_PASSWORD=dev_email_password
```


## To Stop Everything

To close the frontend and the backend, Use `Ctrl + C` on the terminal where frontend and backend were running, respectively.

To close the database:
```bash
docker compose down
```

## Troubleshooting

### Backend Crashes on Login
If you encounter backend crashes during login with errors about missing columns (especially `contractExpiryDate`), ensure you're using the latest backup file:

1. Use `database_backup_pg15_fixed_utf8.sql` for database restoration
2. This file contains all necessary schema updates including the `contractExpiryDate` column
3. If still experiencing issues, verify the column exists:
   ```bash
   docker compose exec database psql -U admin -d SingleDatabase -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'employee' AND column_name = 'contractExpiryDate';"
   ```

### Database Volume Issues
If you encounter permission or volume-related errors:
```bash
# Remove all containers and volumes
docker compose down -v
# Remove specific volume if needed
docker volume rm backend_postgres_data
# Restart with fresh setup
docker compose up -d
```
