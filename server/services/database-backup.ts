import { createClient } from '@supabase/supabase-js';
import { saveDatabaseDump } from './file-storage';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function performDatabaseBackup(): Promise<string> {
  try {
    console.log('Starting full database backup...');

    const { data: agreements, error: agreementsError } = await supabase
      .from('rental_agreements')
      .select('*')
      .order('created_at', { ascending: false });

    if (agreementsError) throw agreementsError;

    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (vehiclesError) throw vehiclesError;

    const { data: backupMetadata, error: backupError } = await supabase
      .from('backup_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (backupError) throw backupError;

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      tables: {
        rental_agreements: {
          count: agreements?.length || 0,
          records: agreements || []
        },
        vehicles: {
          count: vehicles?.length || 0,
          records: vehicles || []
        },
        backup_metadata: {
          count: backupMetadata?.length || 0,
          records: backupMetadata || []
        }
      },
      metadata: {
        backup_date: new Date().toISOString(),
        total_records: (agreements?.length || 0) + (vehicles?.length || 0) + (backupMetadata?.length || 0),
        tables_backed_up: ['rental_agreements', 'vehicles', 'backup_metadata']
      }
    };

    const filePath = await saveDatabaseDump(backupData);
    console.log(`Database backup completed: ${filePath}`);
    console.log(`Total records backed up: ${backupData.metadata.total_records}`);

    return filePath;
  } catch (error) {
    console.error('Error performing database backup:', error);
    throw error;
  }
}
