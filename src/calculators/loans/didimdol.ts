import { LoanResult, HousingInfo, BuyerInfo } from '../../types';
import { DIDIMDOL_LOAN } from '../../constants';

/**
 * 디딤돌 대출 자격 및 한도 계산
 */
export function calculateDidimdolLoan(
  housing: HousingInfo,
  buyer: BuyerInfo
): LoanResult {
  const { price } = housing;
  const { isNewlywed, income, spouseIncome, houseCount } = buyer;
  const totalIncome = income + spouseIncome;

  const eligibilityReasons: string[] = [];
  let eligible = true;

  // 1. 무주택 여부 확인
  if (houseCount > 0) {
    eligible = false;
    eligibilityReasons.push('무주택자만 신청 가능');
  } else {
    eligibilityReasons.push('무주택 요건 충족');
  }

  // 2. 소득 기준 확인
  const incomeLimit = isNewlywed
    ? DIDIMDOL_LOAN.INCOME_LIMIT.NEWLYWED
    : buyer.spouseIncome > 0
    ? DIDIMDOL_LOAN.INCOME_LIMIT.MARRIED
    : DIDIMDOL_LOAN.INCOME_LIMIT.SINGLE;

  if (totalIncome > incomeLimit) {
    eligible = false;
    eligibilityReasons.push(`소득 초과 (한도: ${(incomeLimit / 10000).toLocaleString()}만원)`);
  } else {
    eligibilityReasons.push(`소득 요건 충족 (${(totalIncome / 10000).toLocaleString()}만원)`);
  }

  // 3. 주택 가격 기준
  const priceLimit = isNewlywed
    ? DIDIMDOL_LOAN.PRICE_LIMIT.NEWLYWED
    : DIDIMDOL_LOAN.PRICE_LIMIT.GENERAL;

  if (price > priceLimit) {
    eligible = false;
    eligibilityReasons.push(`주택 가격 초과 (한도: ${(priceLimit / 100000000)}억원)`);
  } else {
    eligibilityReasons.push(`주택 가격 요건 충족`);
  }

  // 4. 대출 한도 계산
  const maxLimit = isNewlywed
    ? DIDIMDOL_LOAN.LOAN_LIMIT.NEWLYWED
    : DIDIMDOL_LOAN.LOAN_LIMIT.GENERAL;

  const ltvLimit = Math.floor(price * DIDIMDOL_LOAN.LTV);
  const limit = eligible ? Math.min(maxLimit, ltvLimit) : 0;

  // 5. 금리
  const rate = isNewlywed ? DIDIMDOL_LOAN.RATE.NEWLYWED : DIDIMDOL_LOAN.RATE.BASE;

  // 6. 월 상환액 계산 (원리금균등, 30년 기준)
  const monthlyPayment = calculateMonthlyPayment(limit, rate, 30);

  return {
    type: 'didimdol',
    name: '디딤돌 대출',
    limit,
    rate,
    monthlyPayment,
    eligible,
    eligibilityReasons,
  };
}

/**
 * 월 상환액 계산 (원리금균등상환)
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || annualRate <= 0) return 0;

  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;

  // 원리금균등상환 공식
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return Math.floor(payment);
}
