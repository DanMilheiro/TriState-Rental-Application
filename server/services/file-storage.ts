import * as fs from 'fs-extra';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import winston from 'winston';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(getBackupBasePath(), 'logs', `backup_log_${new Date().toISOString().split('T')[0]}.txt`)
    })
  ]
});

export function getBackupBasePath(): string {
  return process.env.BACKUP_PATH || '/app/backups';
}

export async function initializeBackupDirectories(): Promise<void> {
  const basePath = getBackupBasePath();
  const directories = [
    'agreements',
    'vehicles',
    'database-dumps',
    'logs'
  ];

  try {
    for (const dir of directories) {
      const fullPath = path.join(basePath, dir);
      await fs.ensureDir(fullPath);
      logger.info(`Initialized directory: ${fullPath}`);
    }
  } catch (error) {
    logger.error('Error initializing backup directories:', error);
    throw error;
  }
}

export async function getAgreementBackupPath(agreementNumber: string, renterName: string, date: Date): Promise<string> {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const monthName = date.toLocaleString('en-US', { month: 'long' });

  const agreementsPath = path.join(
    getBackupBasePath(),
    'agreements',
    String(year),
    `${month}-${monthName}`
  );

  await fs.ensureDir(agreementsPath);

  const sanitizedName = renterName.replace(/[^a-zA-Z0-9]/g, '');
  const dateStr = date.toISOString().split('T')[0];

  return path.join(agreementsPath, `${agreementNumber}_${sanitizedName}_${dateStr}`);
}

export async function saveAgreementBackup(
  agreementId: string,
  agreementNumber: string,
  renterName: string,
  pdfBuffer: Buffer,
  jsonData: any
): Promise<{ pdfPath: string; jsonPath: string }> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const basePath = await getAgreementBackupPath(agreementNumber, renterName, new Date());
      const pdfPath = `${basePath}.pdf`;
      const jsonPath = `${basePath}.json`;

      await fs.writeFile(pdfPath, pdfBuffer);
      await fs.writeJson(jsonPath, jsonData, { spaces: 2 });

      const pdfStats = await fs.stat(pdfPath);
      const jsonStats = await fs.stat(jsonPath);

      await recordBackupMetadata(agreementId, 'pdf', pdfPath, pdfStats.size, 'success');
      await recordBackupMetadata(agreementId, 'json', jsonPath, jsonStats.size, 'success');

      logger.info(`Successfully saved backup for agreement ${agreementNumber} on attempt ${attempt}`);

      return { pdfPath, jsonPath };
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Backup attempt ${attempt} failed for agreement ${agreementNumber}:`, error);

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  const errorMessage = `Failed to save backup after ${maxRetries} attempts: ${lastError?.message}`;
  await recordBackupMetadata(agreementId, 'pdf', '', 0, 'failed', errorMessage);
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

export async function recordBackupMetadata(
  agreementId: string,
  backupType: string,
  filePath: string,
  fileSize: number,
  status: 'success' | 'failed' | 'pending',
  errorMessage?: string
): Promise<void> {
  try {
    const relativePath = filePath.replace(getBackupBasePath(), '');

    const { error } = await supabase
      .from('backup_metadata')
      .insert({
        agreement_id: agreementId,
        backup_type: backupType,
        file_path: relativePath,
        file_size: fileSize,
        backup_status: status,
        error_message: errorMessage || null,
        backup_date: new Date().toISOString(),
        verified: status === 'success'
      });

    if (error) {
      logger.error('Error recording backup metadata:', error);
    }
  } catch (error) {
    logger.error('Failed to record backup metadata:', error);
  }
}

export async function saveVehicleExport(csvContent: string): Promise<string> {
  try {
    const basePath = path.join(getBackupBasePath(), 'vehicles');
    await fs.ensureDir(basePath);

    const dateStr = new Date().toISOString().split('T')[0];
    const filePath = path.join(basePath, `vehicles_export_${dateStr}.csv`);

    await fs.writeFile(filePath, csvContent, 'utf-8');

    const stats = await fs.stat(filePath);
    logger.info(`Vehicle export saved: ${filePath} (${stats.size} bytes)`);

    return filePath;
  } catch (error) {
    logger.error('Error saving vehicle export:', error);
    throw error;
  }
}

export async function saveDatabaseDump(dumpData: any): Promise<string> {
  try {
    const basePath = path.join(getBackupBasePath(), 'database-dumps');
    await fs.ensureDir(basePath);

    const dateStr = new Date().toISOString().split('T')[0];
    const filePath = path.join(basePath, `full_backup_${dateStr}.json`);

    await fs.writeJson(filePath, dumpData, { spaces: 2 });

    const stats = await fs.stat(filePath);
    logger.info(`Database dump saved: ${filePath} (${stats.size} bytes)`);

    return filePath;
  } catch (error) {
    logger.error('Error saving database dump:', error);
    throw error;
  }
}

export async function getBackupStatus(): Promise<any> {
  try {
    const basePath = getBackupBasePath();

    const { data: recentBackups } = await supabase
      .from('backup_metadata')
      .select('*')
      .order('backup_date', { ascending: false })
      .limit(10);

    const { count: totalBackups } = await supabase
      .from('backup_metadata')
      .select('*', { count: 'exact', head: true });

    const { count: failedBackups } = await supabase
      .from('backup_metadata')
      .select('*', { count: 'exact', head: true })
      .eq('backup_status', 'failed');

    let diskUsage = 0;
    try {
      const getDirSize = async (dirPath: string): Promise<number> => {
        let size = 0;
        const files = await fs.readdir(dirPath, { withFileTypes: true });
        for (const file of files) {
          const filePath = path.join(dirPath, file.name);
          if (file.isDirectory()) {
            size += await getDirSize(filePath);
          } else {
            const stats = await fs.stat(filePath);
            size += stats.size;
          }
        }
        return size;
      };
      diskUsage = await getDirSize(basePath);
    } catch (error) {
      logger.warn('Could not calculate disk usage:', error);
    }

    return {
      totalBackups: totalBackups || 0,
      failedBackups: failedBackups || 0,
      recentBackups: recentBackups || [],
      diskUsageBytes: diskUsage,
      diskUsageMB: (diskUsage / 1024 / 1024).toFixed(2),
      backupPath: basePath
    };
  } catch (error) {
    logger.error('Error getting backup status:', error);
    throw error;
  }
}

export async function readBackupFile(filePath: string): Promise<Buffer> {
  try {
    const fullPath = path.join(getBackupBasePath(), filePath);
    const buffer = await fs.readFile(fullPath);
    return buffer;
  } catch (error) {
    logger.error(`Error reading backup file ${filePath}:`, error);
    throw error;
  }
}
