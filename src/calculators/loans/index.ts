export { calculateDidimdolLoan, calculateMonthlyPayment } from './didimdol';
export { calculateNewbornLoan } from './newborn';
export { calculateBankMortgage } from './bankMortgage';

import { LoanResult, HousingInfo, BuyerInfo } from '../../types';
import { calculateDidimdolLoan } from './didimdol';
import { calculateNewbornLoan } from './newborn';
import { calculateBankMortgage } from './bankMortgage';

/**
 * 모든 대출 상품 계산
 */
export function calculateAllLoans(
  housing: HousingInfo,
  buyer: BuyerInfo
): LoanResult[] {
  const loans: LoanResult[] = [];

  // 디딤돌 대출
  const didimdol = calculateDidimdolLoan(housing, buyer);
  loans.push(didimdol);

  // 신생아 특례 대출
  const newborn = calculateNewbornLoan(housing, buyer);
  loans.push(newborn);

  // 시중은행 주담대
  const bank = calculateBankMortgage(housing, buyer);
  loans.push(bank);

  return loans;
}

/**
 * 추천 대출 조합 계산
 * 정책금융 우선, 부족분은 시중은행으로 보완
 */
export function getRecommendedLoanCombination(
  loans: LoanResult[],
  targetAmount: number
): { loans: LoanResult[]; totalAmount: number; monthlyPayment: number } {
  const result: LoanResult[] = [];
  let remaining = targetAmount;
  let totalMonthly = 0;

  // 1순위: 디딤돌 또는 신생아 특례
  const policyLoans = loans.filter(
    (l) => l.eligible && (l.type === 'didimdol' || l.type === 'newborn')
  );

  // 금리가 낮은 순으로 정렬
  policyLoans.sort((a, b) => a.rate - b.rate);

  for (const loan of policyLoans) {
    if (remaining <= 0) break;
    const useAmount = Math.min(loan.limit, remaining);
    if (useAmount > 0) {
      result.push({ ...loan, limit: useAmount });
      remaining -= useAmount;
      totalMonthly += loan.monthlyPayment * (useAmount / loan.limit);
    }
  }

  // 2순위: 시중은행
  if (remaining > 0) {
    const bankLoan = loans.find((l) => l.type === 'bank' && l.eligible);
    if (bankLoan) {
      const useAmount = Math.min(bankLoan.limit, remaining);
      if (useAmount > 0) {
        result.push({ ...bankLoan, limit: useAmount });
        remaining -= useAmount;
        totalMonthly += bankLoan.monthlyPayment * (useAmount / bankLoan.limit);
      }
    }
  }

  return {
    loans: result,
    totalAmount: targetAmount - remaining,
    monthlyPayment: Math.floor(totalMonthly),
  };
}
