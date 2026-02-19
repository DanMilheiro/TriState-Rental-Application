# Backup System Deployment Guide

## Overview

Your Rental Tracker Pro application now includes a comprehensive dual storage backup system that automatically saves all rental agreements to both Supabase cloud database AND your local Windows PC at `C:\Users\Service 2\TriStateRentals\Backups`.

## Backup Features

### 1. Automatic Agreement Backups
- Every rental agreement is automatically saved as both PDF and JSON backup files
- Files are organized by year and month (e.g., `2025/02-February/`)
- PDF includes professional formatting with signature lines
- JSON backup contains complete raw data for recovery

### 2. Scheduled Backups
- **Vehicle Exports**: Daily at midnight (12:00 AM) - CSV file with all vehicles
- **Database Backups**: Daily at 2:00 AM - Complete database dump in JSON format

### 3. Backup Monitoring
- `/api/backups/status` - View backup status and disk usage
- Track successful and failed backups
- Monitor last backup timestamps

### 4. PDF Download
- `/api/agreements/:id/pdf` - Download PDF for any agreement
- Professional printable format with signature lines

## Docker Deployment Instructions

### Prerequisites
1. Ensure Docker Desktop is installed on Windows
2. Create the backup directory: `C:\Users\Service 2\TriStateRentals\Backups`

### Step 1: Build the Docker Image
```bash
docker build -t rental-tracker-pro .
```

### Step 2: Run with Docker Compose
```bash
docker-compose up -d
```

This will:
- Map `C:\Users\Service 2\TriStateRentals\Backups` to the container's `/app/backups`
- Start the application on port 3000
- Enable automatic backups

### Step 3: Verify Backup Directory
After starting, check that these folders were created:
```
C:\Users\Service 2\TriStateRentals\Backups\
├── agreements/
├── vehicles/
├── database-dumps/
└── logs/
```

## File Structure

### Agreement Backups
```
agreements/
  2025/
    02-February/
      AGR-001_JohnDoe_2025-02-19.pdf
      AGR-001_JohnDoe_2025-02-19.json
```

### Vehicle Exports
```
vehicles/
  vehicles_export_2025-02-19.csv
  vehicles_export_2025-02-18.csv
```

### Database Backups
```
database-dumps/
  full_backup_2025-02-19.json
  full_backup_2025-02-18.json
```

### Logs
```
logs/
  backup_log_2025-02-19.txt
```

## API Endpoints

### Get Backup Status
```bash
GET /api/backups/status
```

Returns:
```json
{
  "totalBackups": 25,
  "failedBackups": 0,
  "diskUsageMB": "125.45",
  "recentBackups": [...],
  "backupPath": "/app/backups"
}
```

### Download Agreement PDF
```bash
GET /api/agreements/:id/pdf
```

### Manual Vehicle Export
```bash
POST /api/export/vehicles
```

### Manual Database Backup
```bash
POST /api/backup/database
```

## Troubleshooting

### Backups Not Saving
1. Verify Docker volume is mounted correctly
2. Check Windows folder permissions
3. View logs: `docker logs <container-id>`

### Docker Health Check Failed
The container includes a health check that verifies the backup directory is writable. If it fails:
1. Ensure the Windows path exists
2. Check Docker Desktop file sharing settings
3. Verify no antivirus is blocking Docker

### View Container Logs
```bash
docker-compose logs -f
```

## Environment Variables

Set in `.env` or Docker Compose:
- `BACKUP_PATH=/app/backups` - Container backup path
- `BACKUP_ENABLED=true` - Enable/disable backups
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

## Backup Retention

**All backups are kept permanently** - there is no automatic deletion. You control when to clean up old backups.

## Recovery from Backups

If Supabase data is lost, you can restore from local backups:

1. JSON files contain complete agreement data
2. CSV files contain complete vehicle data
3. Full database dumps can recreate entire database
4. PDFs provide human-readable records

## Support

For issues or questions:
1. Check container logs
2. Verify Windows directory exists and is accessible
3. Ensure Docker has proper permissions
4. Test manual backups using API endpoints

## Backup Verification

After deployment, test the system:
1. Create a test rental agreement
2. Check `C:\Users\Service 2\TriStateRentals\Backups\agreements\` for PDF and JSON
3. Visit `/api/backups/status` to see backup count
4. Wait for scheduled backups or trigger manually
