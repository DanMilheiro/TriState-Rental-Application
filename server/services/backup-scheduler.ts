import cron from 'node-cron';
import { exportVehiclesToCSV } from './vehicle-export';
import { performDatabaseBackup } from './database-backup';

export function initializeBackupScheduler(): void {
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running scheduled vehicle export at midnight...');
      await exportVehiclesToCSV();
      console.log('Vehicle export completed successfully');
    } catch (error) {
      console.error('Scheduled vehicle export failed:', error);
    }
  }, {
    timezone: 'America/New_York'
  });

  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('Running scheduled database backup at 2 AM...');
      await performDatabaseBackup();
      console.log('Database backup completed successfully');
    } catch (error) {
      console.error('Scheduled database backup failed:', error);
    }
  }, {
    timezone: 'America/New_York'
  });

  console.log('Backup scheduler initialized:');
  console.log('- Vehicle exports: Daily at midnight (12:00 AM)');
  console.log('- Database backups: Daily at 2:00 AM');
}
