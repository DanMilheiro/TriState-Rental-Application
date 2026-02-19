import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export interface AgreementData {
  agreement_number: string;
  renter_name: string;
  renter_address: string;
  renter_city: string;
  renter_state: string;
  renter_zip_code: string;
  renter_phone: string;
  renter_email?: string;
  drivers_license: string;
  license_state: string;
  license_expiration: string;
  date_of_birth: string;
  insurance_company: string;
  policy_number: string;
  policy_expiration: string;
  insurance_agent?: string;
  agent_phone?: string;
  adjuster?: string;
  adjuster_phone?: string;
  claim_number?: string;
  date_of_loss?: string;
  original_car_number?: string;
  original_license?: string;
  original_year?: string;
  original_make?: string;
  original_model?: string;
  original_color?: string;
  current_car_number: string;
  current_license: string;
  current_year: string;
  current_make: string;
  current_model: string;
  current_color: string;
  date_due_back?: string;
  mileage_out?: string;
  fuel_gauge_out?: string;
  deposits?: string;
  sales_tax?: string;
  state_sales_tax?: string;
  fuel_charges?: string;
  created_at?: string;
}

export async function generateAgreementPDF(agreementData: AgreementData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(16).font('Helvetica-Bold').text('TRI-STATE AUTO RENTAL', { align: 'center' });
    doc.fontSize(10).font('Helvetica');
    doc.text('718 COTTAGE STREET, PAWTUCKET, RI 02861', { align: 'center' });
    doc.text('Phone: 508-761-9700', { align: 'center' });
    doc.moveDown(0.5);

    doc.fontSize(14).font('Helvetica-Bold').text('RENTAL AGREEMENT', { align: 'center' });
    doc.moveDown(0.5);

    doc.fontSize(11).font('Helvetica');
    doc.text(`Agreement Number: ${agreementData.agreement_number}`, { align: 'right' });
    doc.text(`Date: ${format(new Date(agreementData.created_at || new Date()), 'MM/dd/yyyy')}`, { align: 'right' });
    doc.moveDown(1);

    doc.fontSize(12).font('Helvetica-Bold').text('RENTER INFORMATION');
    doc.fontSize(10).font('Helvetica');
    doc.moveDown(0.3);

    addField(doc, 'Name:', agreementData.renter_name);
    addField(doc, 'Address:', agreementData.renter_address);
    addField(doc, 'City, State, ZIP:', `${agreementData.renter_city}, ${agreementData.renter_state} ${agreementData.renter_zip_code}`);
    addField(doc, 'Phone:', agreementData.renter_phone);
    if (agreementData.renter_email) {
      addField(doc, 'Email:', agreementData.renter_email);
    }
    addField(doc, 'Date of Birth:', format(new Date(agreementData.date_of_birth), 'MM/dd/yyyy'));
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica-Bold').text('LICENSE INFORMATION');
    doc.fontSize(10).font('Helvetica');
    doc.moveDown(0.3);

    addField(doc, 'License Number:', agreementData.drivers_license);
    addField(doc, 'License State:', agreementData.license_state);
    addField(doc, 'License Expiration:', format(new Date(agreementData.license_expiration), 'MM/dd/yyyy'));
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica-Bold').text('INSURANCE INFORMATION');
    doc.fontSize(10).font('Helvetica');
    doc.moveDown(0.3);

    addField(doc, 'Insurance Company:', agreementData.insurance_company);
    addField(doc, 'Policy Number:', agreementData.policy_number);
    addField(doc, 'Policy Expiration:', format(new Date(agreementData.policy_expiration), 'MM/dd/yyyy'));

    if (agreementData.insurance_agent) {
      addField(doc, 'Insurance Agent:', agreementData.insurance_agent);
    }
    if (agreementData.agent_phone) {
      addField(doc, 'Agent Phone:', agreementData.agent_phone);
    }
    if (agreementData.adjuster) {
      addField(doc, 'Adjuster:', agreementData.adjuster);
    }
    if (agreementData.adjuster_phone) {
      addField(doc, 'Adjuster Phone:', agreementData.adjuster_phone);
    }
    if (agreementData.claim_number) {
      addField(doc, 'Claim Number:', agreementData.claim_number);
    }
    if (agreementData.date_of_loss) {
      addField(doc, 'Date of Loss:', format(new Date(agreementData.date_of_loss), 'MM/dd/yyyy'));
    }
    doc.moveDown(0.5);

    if (agreementData.original_make) {
      doc.fontSize(12).font('Helvetica-Bold').text('ORIGINAL VEHICLE (Damaged/In Shop)');
      doc.fontSize(10).font('Helvetica');
      doc.moveDown(0.3);

      if (agreementData.original_car_number) addField(doc, 'Car Number:', agreementData.original_car_number);
      if (agreementData.original_license) addField(doc, 'License Plate:', agreementData.original_license);
      addField(doc, 'Vehicle:', `${agreementData.original_year} ${agreementData.original_make} ${agreementData.original_model}`);
      if (agreementData.original_color) addField(doc, 'Color:', agreementData.original_color);
      doc.moveDown(0.5);
    }

    doc.fontSize(12).font('Helvetica-Bold').text('RENTAL VEHICLE');
    doc.fontSize(10).font('Helvetica');
    doc.moveDown(0.3);

    addField(doc, 'Car Number:', agreementData.current_car_number);
    addField(doc, 'License Plate:', agreementData.current_license);
    addField(doc, 'Vehicle:', `${agreementData.current_year} ${agreementData.current_make} ${agreementData.current_model}`);
    addField(doc, 'Color:', agreementData.current_color);

    if (agreementData.mileage_out) {
      addField(doc, 'Mileage Out:', agreementData.mileage_out);
    }
    if (agreementData.fuel_gauge_out) {
      addField(doc, 'Fuel Gauge Out:', agreementData.fuel_gauge_out);
    }
    if (agreementData.date_due_back) {
      addField(doc, 'Date Due Back:', format(new Date(agreementData.date_due_back), 'MM/dd/yyyy'));
    }
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica-Bold').text('CHARGES & DEPOSITS');
    doc.fontSize(10).font('Helvetica');
    doc.moveDown(0.3);

    if (agreementData.deposits) {
      addField(doc, 'Deposits:', `$${agreementData.deposits}`);
    }
    if (agreementData.sales_tax) {
      addField(doc, 'Sales Tax Rate:', `${agreementData.sales_tax}%`);
    }
    if (agreementData.state_sales_tax) {
      addField(doc, 'State Sales Tax Rate:', `${agreementData.state_sales_tax}%`);
    }
    if (agreementData.fuel_charges) {
      addField(doc, 'Fuel Charges per Gallon:', `$${agreementData.fuel_charges}`);
    }
    doc.moveDown(1);

    doc.addPage();

    doc.fontSize(12).font('Helvetica-Bold').text('RENTAL TERMS AND CONDITIONS');
    doc.fontSize(9).font('Helvetica');
    doc.moveDown(0.5);

    const terms = [
      '1. The renter agrees to return the vehicle in the same condition as received, normal wear and tear excepted.',
      '2. The renter is responsible for all traffic violations, tolls, and parking tickets incurred during the rental period.',
      '3. The vehicle must be returned with the same fuel level as when rented, or fuel charges will apply.',
      '4. Any damage to the vehicle during the rental period is the responsibility of the renter.',
      '5. The renter must have valid insurance coverage for the duration of the rental period.',
      '6. Late returns may incur additional daily charges.',
      '7. Smoking in the vehicle is strictly prohibited and will result in cleaning fees.',
      '8. The vehicle may not be used for illegal purposes or driven outside the authorized area.',
      '9. Only authorized drivers listed on this agreement may operate the vehicle.',
      '10. The renter agrees to notify TRI-STATE AUTO RENTAL immediately in case of accident or mechanical failure.'
    ];

    terms.forEach(term => {
      doc.text(term, { align: 'left' });
      doc.moveDown(0.3);
    });

    doc.moveDown(2);

    doc.fontSize(10).font('Helvetica');
    doc.text('I have read and agree to the terms and conditions stated above.');
    doc.moveDown(2);

    const signatureY = doc.y;
    doc.text('_____________________________________________', 100, signatureY);
    doc.text('Renter Signature', 100, signatureY + 20);

    doc.text('_____________________________________________', 320, signatureY);
    doc.text('Date', 320, signatureY + 20);

    doc.moveDown(4);

    const agentSignatureY = doc.y;
    doc.text('_____________________________________________', 100, agentSignatureY);
    doc.text('Agent Signature', 100, agentSignatureY + 20);

    doc.text('_____________________________________________', 320, agentSignatureY);
    doc.text('Date', 320, agentSignatureY + 20);

    doc.moveDown(3);
    doc.fontSize(8).font('Helvetica');
    doc.text('For office use only:', { align: 'left' });
    doc.moveDown(0.3);
    doc.text(`Agreement created: ${format(new Date(agreementData.created_at || new Date()), 'MM/dd/yyyy hh:mm a')}`);

    doc.end();
  });
}

function addField(doc: PDFKit.PDFDocument, label: string, value: string): void {
  doc.font('Helvetica-Bold').text(label, { continued: true });
  doc.font('Helvetica').text(` ${value}`);
}
