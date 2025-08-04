# HR Management - Docker Setup

This document describes how to run the HR Management application using Docker containers.

## Quick Start

### Option 1: Use the Startup Scripts (Recommended)

```bash
# Start the entire application
./start-app.sh

# Stop the application
./stop-app.sh
```

### Option 2: Manual Setup

1. **Create the shared network** (only needed once):
```bash
docker network create app-network
```

2. **Start the backend** (database + API):
```bash
cd backend
docker compose up --build -d
```

3. **Start the frontend**:
```bash
cd frontend
docker compose up --build -d
```

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database Admin (Adminer)**: http://localhost:8080

## Architecture

The application consists of:

1. **Backend Container** (`backend` service)
   - Node.js/Express API server
   - Runs on port 5000
   - Connected to PostgreSQL database

2. **Database Container** (`database` service)
   - PostgreSQL 15
   - Automatically initialized with `database_backup_utf8_fixed.sql`
   - Data persisted in Docker volume

3. **Frontend Container** (`frontend` service)
   - React application
   - Runs on port 3000
   - Configured to communicate with backend

4. **Database Admin Panel** (`uipanel` service)
   - Adminer web interface
   - Runs on port 8080

## Environment Variables

### Backend
The backend container uses these environment variables:
- `DB`: SingleDatabase
- `USER`: admin
- `PASSWORD`: admin
- `HOST`: database (container name)
- `DIALECT`: postgres
- `PORT`: 5432
- `HTTP_PORT`: 5000

### Frontend
The frontend container uses:
- `REACT_APP_BACKEND_URL`: http://localhost:5000
- Hot reloading is enabled for development

## Development

### Viewing Logs
```bash
# Backend logs
cd backend && docker compose logs -f

# Frontend logs
cd frontend && docker compose logs -f

# Specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Rebuilding After Changes
```bash
# Rebuild and restart backend
cd backend && docker compose up --build -d

# Rebuild and restart frontend
cd frontend && docker compose up --build -d
```

### Database Access

1. **Via Adminer**: http://localhost:8080
   - Server: database
   - Username: admin
   - Password: admin
   - Database: SingleDatabase

2. **Via Command Line**:
```bash
docker compose exec database psql -U admin -d SingleDatabase
```

## Stopping and Cleaning Up

### Stop All Services
```bash
./stop-app.sh
# OR manually:
cd frontend && docker compose down
cd ../backend && docker compose down
```

### Remove All Data (including database)
```bash
cd backend
docker compose down -v
```

### Remove All Images and Containers
```bash
docker system prune -a
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Make sure no other services are running on ports 3000, 5000, 5432, or 8080
   - Check with: `lsof -i :3000` (replace with port number)

2. **Database connection errors**:
   - Ensure the database container is fully started before the backend
   - Check logs: `cd backend && docker compose logs database`

3. **Frontend can't reach backend**:
   - Verify both containers are on the same network: `docker network ls`
   - Check if backend is responding: `curl http://localhost:5000`

4. **Permission errors**:
   - Make sure Docker has permissions to access the project directory
   - On Linux, you might need to run with `sudo` or add your user to the docker group

### Useful Commands

```bash
# Check running containers
docker ps

# Check networks
docker network ls

# Check volumes
docker volume ls

# Access container shell
docker compose exec backend sh
docker compose exec frontend sh

# View container resource usage
docker stats
```

## Deployment Notes

This setup is designed for deployment on platforms that support Docker Compose files. The application will:

1. Automatically initialize the database from the backup file
2. Handle container communication via Docker networks
3. Persist database data across container restarts
4. Support both development and production environments

For production deployment, consider:
- Using environment-specific configuration files
- Setting up proper SSL/TLS certificates
- Configuring proper logging and monitoring
- Using Docker secrets for sensitive data
