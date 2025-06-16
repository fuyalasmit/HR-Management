## Start the backend

### Navigate to it

```bash
cd backend
```
### Install the node modules (the dependencies)

```bash
pnpm install
```

### Setup the Database

```bash
docker compose up
```

### Start the backend

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
