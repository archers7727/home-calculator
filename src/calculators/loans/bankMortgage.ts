import { LoanResult, HousingInfo, BuyerInfo } from '../../types';
import { BANK_MORTGAGE } from '../../constants';
import { calculateMonthlyPayment } from './didimdol';

/**
 * 시중은행 주담대 한도 계산
 */
export function calculateBankMortgage(
  housing: HousingInfo,
  buyer: BuyerInfo
): LoanResult {
  const { price, isAdjustmentArea } = housing;
  const { income, spouseIncome } = buyer;
  const totalIncome = income + spouseIncome;

  const eligibilityReasons: string[] = [];
  const eligible = true; // 시중은행은 기본적으로 대출 가능

  // 1. LTV 기준 한도
  const ltvRate = isAdjustmentArea
    ? BANK_MORTGAGE.LTV.ADJUSTMENT
    : BANK_MORTGAGE.LTV.NON_ADJUSTMENT;
  const ltvLimit = Math.floor(price * ltvRate);

  eligibilityReasons.push(
    `LTV ${(ltvRate * 100).toFixed(0)}% 적용 (${isAdjustmentArea ? '조정대상지역' : '비조정지역'})`
  );

  // 2. DSR 기준 한도
  // 연간 원리금 상환 가능액 = 연소득 × DSR
  const annualPaymentLimit = totalIncome * BANK_MORTGAGE.DSR;
  // 30년 원리금균등 기준으로 역산
  const avgRate = (BANK_MORTGAGE.RATE.MIN + BANK_MORTGAGE.RATE.MAX) / 2;
  const dsrLimit = calculateMaxLoanFromPayment(annualPaymentLimit / 12, avgRate, 30);

  eligibilityReasons.push(`DSR ${(BANK_MORTGAGE.DSR * 100).toFixed(0)}% 적용`);

  // 3. 최종 한도 (LTV, DSR 중 작은 값)
  const limit = Math.min(ltvLimit, dsrLimit);

  if (limit === dsrLimit) {
    eligibilityReasons.push('DSR 기준으로 한도 제한');
  } else {
    eligibilityReasons.push('LTV 기준으로 한도 제한');
  }

  // 4. 금리 (평균값 사용)
  const rate = avgRate;

  // 5. 월 상환액
  const monthlyPayment = calculateMonthlyPayment(limit, rate, 30);

  return {
    type: 'bank',
    name: '시중은행 주담대',
    limit,
    rate,
    monthlyPayment,
    eligible,
    eligibilityReasons,
  };
}

/**
 * 월 상환액으로부터 최대 대출 가능액 역산
 */
function calculateMaxLoanFromPayment(
  monthlyPayment: number,
  annualRate: number,
  years: number
): number {
  if (monthlyPayment <= 0 || annualRate <= 0) return 0;

  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;

  // 원리금균등상환 역산 공식
  const principal =
    (monthlyPayment * (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));

  return Math.floor(principal);
}
