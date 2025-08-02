## Start the backend

This guide provides the definitive steps to set up and run the backend, ensuring a consistent development environment by using a database backup.

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Reset and Restore the Database

To guarantee a clean and consistent state, the setup process involves resetting the database and restoring it from the `database_backup.sql` file.

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

If you encounter UTF-8 encoding errors, use this method:

```bash
# Copy the backup file into the container (avoids encoding issues)
docker compose cp database_backup.sql database:/tmp/backup.sql

# Restore from inside the container
docker compose exec database psql -U admin -d SingleDatabase -f /tmp/backup.sql
```

**Alternative method (if the above doesn't work):**

```bash
# First, check the encoding of your backup file
file -i database_backup.sql

# Convert from UTF-16LE to UTF-8 (most common case for this error)
iconv -f UTF-16LE -t UTF-8 database_backup.sql > database_backup_utf8.sql

# Or if it shows a different encoding, try these alternatives:
# iconv -f ISO-8859-1 -t UTF-8 database_backup.sql > database_backup_utf8.sql
# iconv -f WINDOWS-1252 -t UTF-8 database_backup.sql > database_backup_utf8.sql

# Then restore using the converted file
cat database_backup_utf8.sql | docker compose exec -T database psql -U admin -d SingleDatabase
```

**If you're still getting errors, try this method:**

```bash
# Remove any BOM (Byte Order Mark) and convert encoding
sed '1s/^\xEF\xBB\xBF//' database_backup.sql | iconv -f UTF-16LE -t UTF-8 > database_backup_clean.sql

# Then restore
cat database_backup_clean.sql | docker compose exec -T database psql -U admin -d SingleDatabase
```

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
