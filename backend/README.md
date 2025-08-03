![](https://img.shields.io/github/license/bluewave-labs/bluewave-hrm)
![](https://img.shields.io/github/repo-size/bluewave-labs/bluewave-hrm)
![](https://img.shields.io/github/commit-activity/w/bluewave-labs/bluewave-hrm)
![](https://img.shields.io/github/last-commit/bluewave-labs/bluewave-hrm)
![](https://img.shields.io/github/languages/top/bluewave-labs/bluewave-hrm)
![](https://img.shields.io/github/issues-pr/bluewave-labs/bluewave-hrm)
![](https://img.shields.io/github/issues/bluewave-labs/bluewave-hrm)

<h1 align="center">HR Management System</h1>

<p align="center"><strong>An open source human resource management application</strong></p>


![Time off settings](https://github.com/bluewave-labs/hrm/blob/main/Time%20off.png?raw=true)

The HR Management System is a people and resource management application for your organization. It has the following features: 

- Team management
- Employee management
- Time off & vacation management
- Reporting


---

## Database Management

This project uses Docker to run a PostgreSQL database. The data is persisted using a named Docker volume called `postgres_data`, as configured in the `docker-compose.yaml` file.


### Restoring the Database

To restore the database from the backup file, you must first ensure the target database is completely empty. The following steps will destroy your current local database and restore it from `database_backup.sql`.

**Warning:** This is a destructive process that will permanently delete your existing local database data.

0. **Enter backend**
    ```
    cd backend
    ```
    
1.  **Stop and remove the running containers:**
    ```bash
    docker-compose down
    ```

2.  **Delete the existing database volume:**
    ```bash
    docker volume rm backend_postgres_data
    ```
    *(Note: If your volume has a different name, you can find it by running `docker volume ls`)*

3.  **Start the services again:** This will create a new, empty database.
    ```bash
    docker-compose up -d
    ```

4.  **Import the backup file:**
    ```bash
    cat database_backup.sql | docker-compose exec -T database psql -U admin -d SingleDatabase
    ```
    
### Backing Up the Database

To create a backup of your local database, run the following command from your terminal. This will create a `database_backup.sql` file in the `backend` directory.

```bash
docker-compose exec -T database pg_dump -U admin -d SingleDatabase > database_backup.sql
```



### Incase of error with login:
Paste the following into database_backup.sql under the section "Data for Name: appUser; Type: TABLE DATA; Schema: public; Owner: admin", on line 1955, replacing whatever is stored there. The email will be reset to admin@admin.com and password to Password1! 

```

--
-- Data for Name: appUser; Type: TABLE DATA; Schema: public; Owner: admin
--


COPY public."appUser" (id, "firstName", "lastName", email, password, "empId", access, "permissionId", "passwordChangedAt", "passwordResetToken", "passwordResetTokenExpiresAt", "autoDeleteAt", "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	Admin	Admin	admin@admin.com	$2b$10$YVo3UzO5TqzyeoJnmc5I9.KGIDhBKE7xN.GCXIdBQeUwVSeNq/LfG	100	Permitted	1	2024-01-31 05:00:00+00	\N	\N	\N	2025-08-03 17:38:05.751+00	2025-08-03 17:40:07.271+00	\N
\.
```