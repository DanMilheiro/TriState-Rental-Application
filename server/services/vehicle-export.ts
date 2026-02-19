import { createObjectCsvStringifier } from 'csv-writer';
import { createClient } from '@supabase/supabase-js';
import { saveVehicleExport } from './file-storage';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function exportVehiclesToCSV(): Promise<string> {
  try {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'make', title: 'Make' },
        { id: 'model', title: 'Model' },
        { id: 'year', title: 'Year' },
        { id: 'plate', title: 'License Plate' },
        { id: 'vin', title: 'VIN' },
        { id: 'status', title: 'Status' },
        { id: 'type', title: 'Type' },
        { id: 'color', title: 'Color' },
        { id: 'mileage', title: 'Mileage' },
        { id: 'created_at', title: 'Created At' },
        { id: 'updated_at', title: 'Updated At' }
      ]
    });

    const csvHeader = csvStringifier.getHeaderString();
    const csvBody = csvStringifier.stringifyRecords(vehicles || []);
    const csvContent = csvHeader + csvBody;

    const filePath = await saveVehicleExport(csvContent);
    console.log(`Vehicle export completed: ${filePath}`);

    return filePath;
  } catch (error) {
    console.error('Error exporting vehicles:', error);
    throw error;
  }
}
