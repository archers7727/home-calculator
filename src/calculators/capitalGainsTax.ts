import { differenceInMonths } from 'date-fns';
import { PropertyForSale, SaleCalculation, TaxExemptionConditions } from '../types';
import { CAPITAL_GAINS_TAX_BRACKETS, LONG_TERM_HOLDING_DEDUCTION } from '../constants';
import { calculateBrokerageFee } from './brokerageFee';

/**
 * 양도소득세 비과세 조건 확인
 */
export function checkTaxExemption(
  property: PropertyForSale,
  salePrice: number
): { isExempt: boolean; conditions: TaxExemptionConditions } {
  const holdingMonths = differenceInMonths(new Date(), property.purchaseDate);
  const residenceMonths = property.residenceYears * 12 + property.residenceMonths;

  const conditions: TaxExemptionConditions = {
    isSingleHousehold: property.isSingleHousehold,
    holdingOver2Years: holdingMonths >= 24,
    residenceOver2Years: residenceMonths >= 24,
    priceUnder12Billion: salePrice <= 1_200_000_000,
  };

  const isExempt = Object.values(conditions).every((v) => v);

  return { isExempt, conditions };
}

/**
 * 장기보유특별공제율 계산 (1세대 1주택)
 */
export function calculateLongTermDeductionRate(
  holdingYears: number,
  residenceYears: number,
  isSingleHousehold: boolean
): number {
  if (!isSingleHousehold || holdingYears < LONG_TERM_HOLDING_DEDUCTION.MIN_YEARS) {
    return 0;
  }

  // 보유기간 공제 (연 8%, 최대 40%)
  const holdingRate = Math.min(
    holdingYears * LONG_TERM_HOLDING_DEDUCTION.HOLDING_RATE_PER_YEAR,
    LONG_TERM_HOLDING_DEDUCTION.HOLDING_MAX
  );

  // 거주기간 공제 (연 8%, 최대 40%)
  const residenceRate = Math.min(
    residenceYears * LONG_TERM_HOLDING_DEDUCTION.RESIDENCE_RATE_PER_YEAR,
    LONG_TERM_HOLDING_DEDUCTION.RESIDENCE_MAX
  );

  return holdingRate + residenceRate;
}

/**
 * 누진세율 적용
 */
export function applyProgressiveTaxRate(taxBase: number): number {
  if (taxBase <= 0) return 0;

  for (const bracket of CAPITAL_GAINS_TAX_BRACKETS) {
    if (taxBase <= bracket.limit) {
      return Math.floor(taxBase * bracket.rate - bracket.deduction);
    }
  }

  // 마지막 구간
  const lastBracket = CAPITAL_GAINS_TAX_BRACKETS[CAPITAL_GAINS_TAX_BRACKETS.length - 1];
  return Math.floor(taxBase * lastBracket.rate - lastBracket.deduction);
}

/**
 * 양도소득세 계산
 */
export function calculateCapitalGainsTax(
  purchasePrice: number,
  salePrice: number,
  holdingYears: number,
  residenceYears: number,
  isSingleHousehold: boolean
): number {
  const capitalGain = salePrice - purchasePrice;
  if (capitalGain <= 0) return 0;

  // 필요경비 (간편계산: 취득가의 약 2%)
  const expenses = Math.floor(purchasePrice * 0.02);

  // 장기보유특별공제
  const deductionRate = calculateLongTermDeductionRate(
    holdingYears,
    residenceYears,
    isSingleHousehold
  );
  const deduction = Math.floor((capitalGain - expenses) * deductionRate);

  // 양도소득금액
  const taxableIncome = capitalGain - expenses - deduction;

  // 기본공제 250만원
  const basicDeduction = 2_500_000;
  const taxBase = Math.max(0, taxableIncome - basicDeduction);

  // 누진세율 적용
  return applyProgressiveTaxRate(taxBase);
}

/**
 * 매도 비용 종합 계산
 */
export function calculateSaleResult(property: PropertyForSale): SaleCalculation {
  const salePrice = property.currentValue;
  const holdingMonths = differenceInMonths(new Date(), property.purchaseDate);
  const holdingYears = Math.floor(holdingMonths / 12);
  const residenceYears = property.residenceYears;
  const residenceMonths = property.residenceMonths;

  // 양도차익
  const capitalGain = salePrice - property.purchasePrice;

  // 비과세 여부 확인
  const { isExempt, conditions } = checkTaxExemption(property, salePrice);

  // 장기보유특별공제율
  const longTermDeductionRate = calculateLongTermDeductionRate(
    holdingYears,
    residenceYears,
    property.isSingleHousehold
  );

  // 양도소득세
  let capitalGainsTax = 0;
  let longTermDeduction = 0;

  if (!isExempt && capitalGain > 0) {
    capitalGainsTax = calculateCapitalGainsTax(
      property.purchasePrice,
      salePrice,
      holdingYears,
      residenceYears,
      property.isSingleHousehold
    );

    // 공제액 계산 (표시용)
    const expenses = Math.floor(property.purchasePrice * 0.02);
    longTermDeduction = Math.floor((capitalGain - expenses) * longTermDeductionRate);
  }

  // 중개수수료
  const brokerageFee = calculateBrokerageFee(salePrice);

  // 실수령액
  const netProceeds = salePrice - capitalGainsTax - brokerageFee.total;

  return {
    capitalGain,
    holdingYears,
    holdingMonths: holdingMonths % 12,
    capitalGainsTax,
    longTermDeduction,
    longTermDeductionRate,
    brokerageFee,
    netProceeds,
    isTaxExempt: isExempt,
    exemptionConditions: conditions,
  };
}
