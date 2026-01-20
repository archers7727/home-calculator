import jsPDF from 'jspdf';
import { HousingInfo, BuyerInfo, CostCalculation, LoanResult, PropertyForSale, SaleCalculation } from '../types';
import { formatPriceWon, formatPercent, formatArea } from '../constants';

interface FirstBuyPDFData {
  housing: HousingInfo;
  buyer: BuyerInfo;
  cost: CostCalculation;
  loans: LoanResult[];
  availableCapital: number;
  recommendation: {
    loans: LoanResult[];
    totalAmount: number;
    monthlyPayment: number;
  };
}

export function generateFirstBuyPDF(data: FirstBuyPDFData) {
  const { housing, buyer, cost, loans, availableCapital, recommendation } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Helper functions
  const addTitle = (text: string) => {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(text, pageWidth / 2, y, { align: 'center' });
    y += 12;
  };

  const addSectionTitle = (text: string) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235); // Blue
    doc.text(text, 20, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
  };

  const addRow = (label: string, value: string, isTotal = false) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
    doc.text(label, 25, y);
    doc.text(value, pageWidth - 25, y, { align: 'right' });
    y += 6;
  };

  const addLine = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageWidth - 20, y);
    y += 5;
  };

  const addSpace = (space = 8) => {
    y += space;
  };

  // Title
  addTitle('Home Purchase Simulation Report');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('ko-KR')}`, pageWidth / 2, y, {
    align: 'center',
  });
  y += 15;

  // Total Amount Box
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(20, y, pageWidth - 40, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Total Required Amount', pageWidth / 2, y + 8, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(formatPriceWon(cost.total), pageWidth / 2, y + 18, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 35;

  // Housing Info
  addSectionTitle('Property Information');
  addRow('Purchase Price', formatPriceWon(housing.price));
  addRow('Type', housing.type === 'apartment' ? 'Apartment' : housing.type);
  addRow('Area', formatArea(housing.area));
  addRow('Location', `${housing.region} ${housing.district}`);
  addRow('Adjustment Area', housing.isAdjustmentArea ? 'Yes' : 'No');
  addSpace();

  // Buyer Info
  addSectionTitle('Buyer Information');
  addRow('Current Property Count', `${buyer.houseCount}`);
  addRow('First-time Buyer', buyer.isFirstTime ? 'Yes' : 'No');
  addRow('Newlywed', buyer.isNewlywed ? 'Yes' : 'No');
  addRow('Combined Income', formatPriceWon(buyer.income + buyer.spouseIncome));
  addSpace();

  // Cost Breakdown
  addSectionTitle('Cost Breakdown');
  addLine();
  addRow('Purchase Price', formatPriceWon(housing.price));
  addSpace(2);
  addRow(`Acquisition Tax (${formatPercent(cost.acquisitionTax.baseRate)})`, formatPriceWon(cost.acquisitionTax.baseTax));
  if (cost.acquisitionTax.ruralTax > 0) {
    addRow('Rural Special Tax', formatPriceWon(cost.acquisitionTax.ruralTax));
  }
  addRow('Local Education Tax', formatPriceWon(cost.acquisitionTax.educationTax));
  if (cost.acquisitionTax.reduction > 0) {
    addRow('First-time Buyer Reduction', `-${formatPriceWon(cost.acquisitionTax.reduction)}`);
  }
  addRow('Tax Subtotal', formatPriceWon(cost.acquisitionTax.total), true);
  addSpace(2);
  addRow('Brokerage Fee (incl. VAT)', formatPriceWon(cost.brokerageFee.total));
  addRow('Legal Fee', formatPriceWon(cost.lawyerFee));
  addRow('Housing Bond Discount', formatPriceWon(cost.housingBond));
  addRow('Stamp Duty', formatPriceWon(cost.stampDuty));
  addRow('Moving Cost (Est.)', formatPriceWon(cost.movingCost));
  addLine();
  addRow('Additional Costs Total', formatPriceWon(cost.totalAdditional), true);
  addSpace();

  // Funding Plan
  addSectionTitle('Funding Plan');
  addLine();
  addRow('Total Required', formatPriceWon(cost.total));
  addRow('Available Capital', formatPriceWon(availableCapital));
  addRow('Loan Amount', formatPriceWon(recommendation.totalAmount));
  const additionalNeeded = Math.max(0, cost.total - availableCapital - recommendation.totalAmount);
  addRow('Additional Needed', formatPriceWon(additionalNeeded), true);
  addSpace(2);

  if (recommendation.monthlyPayment > 0) {
    addRow('Est. Monthly Payment', `~${formatPriceWon(recommendation.monthlyPayment)}`);
    doc.setFontSize(8);
    doc.text('(Based on 30-year amortization)', 25, y);
    y += 6;
  }
  addSpace();

  // Loan Details
  if (recommendation.loans.length > 0) {
    addSectionTitle('Recommended Loan Combination');
    recommendation.loans.forEach((loan) => {
      addRow(`${loan.name}`, `${formatPriceWon(loan.limit)} @ ${formatPercent(loan.rate)}`);
    });
  }

  // Footer
  y = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    'This report is for reference only. Actual taxes and loan conditions may vary.',
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  doc.text(
    'Please consult with tax professionals and financial institutions for accurate information.',
    pageWidth / 2,
    y + 4,
    { align: 'center' }
  );

  // Save
  const fileName = `home-purchase-simulation-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Trade-up PDF
interface TradeUpPDFData {
  currentProperty: PropertyForSale;
  saleResult: SaleCalculation;
  newProperty: HousingInfo;
  purchaseCost: CostCalculation;
  loans: LoanResult[];
  recommendation: {
    loans: LoanResult[];
    totalAmount: number;
    monthlyPayment: number;
  };
  additionalFundsNeeded: number;
  requiredCapital: number;
}

export function generateTradeUpPDF(data: TradeUpPDFData) {
  const {
    currentProperty,
    saleResult,
    newProperty,
    purchaseCost,
    recommendation,
    additionalFundsNeeded,
    requiredCapital,
  } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Helper functions
  const addTitle = (text: string) => {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(text, pageWidth / 2, y, { align: 'center' });
    y += 12;
  };

  const addSectionTitle = (text: string) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(text, 20, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
  };

  const addRow = (label: string, value: string, isTotal = false) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
    doc.text(label, 25, y);
    doc.text(value, pageWidth - 25, y, { align: 'right' });
    y += 6;
  };

  const addLine = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageWidth - 20, y);
    y += 5;
  };

  const addSpace = (space = 8) => {
    y += space;
  };

  // Title
  addTitle('Trade-Up Simulation Report');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('ko-KR')}`, pageWidth / 2, y, {
    align: 'center',
  });
  y += 15;

  // Summary Box
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(20, y, pageWidth - 40, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Additional Funds Needed', pageWidth / 2, y + 8, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(formatPriceWon(additionalFundsNeeded), pageWidth / 2, y + 18, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 35;

  // Current Property Sale
  addSectionTitle('Current Property (Sale)');
  addLine();
  addRow('Sale Price', formatPriceWon(currentProperty.currentValue));
  addRow('Purchase Price', formatPriceWon(currentProperty.purchasePrice));
  addRow('Capital Gain', formatPriceWon(saleResult.capitalGain));
  addSpace(2);
  addRow(
    'Capital Gains Tax',
    saleResult.isTaxExempt ? '0 (Tax Exempt)' : formatPriceWon(saleResult.capitalGainsTax)
  );
  addRow('Brokerage Fee', formatPriceWon(saleResult.brokerageFee.total));
  addLine();
  addRow('Net Proceeds', formatPriceWon(saleResult.netProceeds), true);
  addSpace();

  // Tax Exemption Status
  if (saleResult.isTaxExempt) {
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129); // Green
    doc.text('* 1-house tax exemption applied', 25, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
  }

  // New Property Purchase
  addSectionTitle('New Property (Purchase)');
  addLine();
  addRow('Purchase Price', formatPriceWon(newProperty.price));
  addRow('Area', formatArea(newProperty.area));
  addRow('Location', `${newProperty.region} ${newProperty.district}`);
  addSpace(2);
  addRow(`Acquisition Tax (${formatPercent(purchaseCost.acquisitionTax.baseRate)})`, formatPriceWon(purchaseCost.acquisitionTax.total));
  addRow('Brokerage Fee', formatPriceWon(purchaseCost.brokerageFee.total));
  addRow('Legal & Other Fees', formatPriceWon(purchaseCost.lawyerFee + purchaseCost.housingBond + purchaseCost.stampDuty));
  addLine();
  addRow('Total Cost', formatPriceWon(purchaseCost.total), true);
  addSpace();

  // Funding Plan
  addSectionTitle('Funding Plan');
  addLine();
  addRow('New Property Total Cost', formatPriceWon(purchaseCost.total));
  addRow('Net Proceeds from Sale', `-${formatPriceWon(saleResult.netProceeds)}`);
  addRow('Additional Funds Needed', formatPriceWon(additionalFundsNeeded), true);
  addSpace(2);
  addRow('Loan Available', formatPriceWon(recommendation.totalAmount));
  addRow('Required Capital', formatPriceWon(requiredCapital), true);
  addSpace();

  if (recommendation.monthlyPayment > 0) {
    addRow('Est. Monthly Payment', `~${formatPriceWon(recommendation.monthlyPayment)}`);
    doc.setFontSize(8);
    doc.text('(Based on 30-year amortization)', 25, y);
    y += 8;
  }

  // Loan Details
  if (recommendation.loans.length > 0) {
    addSpace();
    addSectionTitle('Recommended Loans');
    recommendation.loans.forEach((loan) => {
      addRow(`${loan.name}`, `${formatPriceWon(loan.limit)} @ ${formatPercent(loan.rate)}`);
    });
  }

  // Footer
  y = doc.internal.pageSize.getHeight() - 25;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Important Notes:', 20, y);
  y += 4;
  doc.text('- Temporary 2-house: Must sell existing property within 3 years', 20, y);
  y += 4;
  doc.text('- This report is for reference only. Actual taxes may vary.', 20, y);
  y += 4;
  doc.text('- Please consult with tax professionals for accurate information.', 20, y);

  // Save
  const fileName = `trade-up-simulation-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
