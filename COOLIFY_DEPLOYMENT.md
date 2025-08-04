# Coolify Deployment Guide (Simplified)

This guide explains how to deploy the HR Management application using Coolify on your own VM.

## Overview

The application has been restructured to work seamlessly with Coolify by:

- Creating a unified docker-compose file
- Removing external network dependencies
- Using development configuration for simplicity (perfect for personal VM)

## Files Added/Modified

1. **`docker-compose.yaml`** - Unified compose file for both local and Coolify
2. **`frontend/Dockerfile`** - Simple development Dockerfile
3. **Original separate compose files** - Still available in respective folders

## Deployment in Coolify

### Single Application Deployment

Deploy the entire stack as one application in Coolify:

1. **Create New Application** in Coolify
2. **Source**: Connect your Git repository
3. **Build Pack**: Choose "Docker Compose"
4. **Compose File**: Use `docker-compose.yaml` (root folder)
5. **No environment variables needed** - everything uses default dev values

### Coolify Configuration Steps

#### 1. Repository Setup

- Push your code to a Git repository
- Ensure `docker-compose.yaml` is in the root

#### 2. Create Application in Coolify

```
Application Type: Docker Compose
Repository: your-repo-url
Branch: main
Compose File: docker-compose.yaml
```

#### 3. Port Configuration

Coolify will automatically expose:

- **Frontend**: Port 3000 (your main app)
- **Backend**: Port 5000 (API access if needed)
- **Database**: Port 5432 (database access if needed)
- **Admin Panel**: Port 8080 (Adminer for database management)

#### 4. Domain Setup

- Set your domain to point to the frontend (port 3000)
- Example: `hr-app.yourdomain.com` → Frontend
- Optional: `api.hr-app.yourdomain.com` → Backend (port 5000)
- Optional: `db.hr-app.yourdomain.com` → Adminer (port 8080)

## Network Architecture

**Before (Manual Setup):**

```
External Network: app-network (bridge) - Required manual creation
├── Frontend Container
├── Backend Container
└── Database Container
```

**After (Simplified for Coolify):**

```
Internal Network: app-network (automatic)
├── Frontend Container (port 3000) → Public
├── Backend Container (port 5000) → Public (for direct API access)
├── Database Container (port 5432) → Public (for direct DB access)
└── Admin Panel (port 8080) → Public (for DB management)
```

## Key Changes Made

1. **Removed External Network Dependency**:

   - No need to manually create `docker network create app-network`
   - Network is automatically created by Docker Compose

2. **Service Discovery**:

   - Backend connects to database via hostname `database`
   - Frontend connects to backend via hostname `backend`

3. **Simplified Configuration**:

   - All services expose ports for easy access
   - Uses default development credentials
   - No environment variables required

4. **Development Features Kept**:
   - Hot reloading for frontend
   - Volume mounts for live code updates
   - Adminer for database management

## Default Credentials

- **Database**:

  - User: `admin`
  - Password: `admin`
  - Database: `SingleDatabase`

- **Backend**: Uses development secrets (fine for personal VM)

## Local Development

You can use the same `docker-compose.yaml` for local development:

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down
```

## Troubleshooting

### Common Issues

1. **Frontend can't reach backend**:

   - The frontend automatically connects to `http://backend:5000`
   - No configuration needed

2. **Database connection failed**:

   - Database uses default credentials (admin/admin)
   - Check if database container is running

3. **Port conflicts**:
   - If ports are already in use, modify the ports in docker-compose.yaml
   - Example: Change `"3000:3000"` to `"3001:3000"`

## Migration from Current Setup

1. **Stop current containers**:

   ```bash
   docker-compose -f frontend/docker-compose.yaml down
   docker-compose -f backend/docker-compose.yaml down
   # No need to remove network - it wasn't external anyway
   ```

2. **Test new setup locally**:

   ```bash
   docker-compose up
   ```

3. **Deploy to Coolify** using the steps above

## Benefits of This Approach

- **Simple**: No environment variables to manage
- **Fast**: Development mode with hot reloading
- **Complete**: All services accessible for debugging
- **Secure enough**: Running on your own VM
- **Easy**: One command deployment in Coolify
