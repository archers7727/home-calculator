import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  ResultSection,
  ResultRow,
  ConditionCheck,
  TotalResultCard,
} from '../../components/ui';
import { useTradeUpStore } from '../../store';
import { calculateSaleResult } from '../../calculators';
import { PropertyForSale } from '../../types';
import { formatPriceWon, formatPercent } from '../../constants';

export function Step2SaleCost() {
  const {
    currentProperty,
    saleResult,
    setSaleResult,
    nextStep,
    prevStep,
  } = useTradeUpStore();

  // Calculate sale result
  useEffect(() => {
    if (currentProperty.currentValue && currentProperty.purchasePrice) {
      const result = calculateSaleResult(currentProperty as PropertyForSale);
      setSaleResult(result);
    }
  }, [currentProperty, setSaleResult]);

  if (!saleResult) {
    return <div className="text-center py-10">계산 중...</div>;
  }

  const { exemptionConditions, isTaxExempt } = saleResult;

  return (
    <div className="space-y-6">
      {/* Sale Summary */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            💸 매도 시 예상 비용
          </h3>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-slate-500">매도 예상가</p>
              <p className="text-xl font-bold text-slate-900">
                {formatPriceWon(currentProperty.currentValue || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">매입가</p>
              <p className="text-xl font-bold text-slate-900">
                {formatPriceWon(currentProperty.purchasePrice || 0)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">양도차익</span>
              <span className="text-xl font-bold text-blue-700">
                {formatPriceWon(saleResult.capitalGain)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Exemption Check */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            📋 양도소득세 계산
          </h3>

          <div
            className={`p-4 rounded-lg border ${
              isTaxExempt
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{isTaxExempt ? '✅' : '⚠️'}</span>
              <span
                className={`font-bold ${
                  isTaxExempt ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                1세대 1주택 비과세{' '}
                {isTaxExempt ? '조건 충족' : '조건 미충족'}
              </span>
            </div>

            <div className="space-y-2">
              <ConditionCheck
                label="1세대 1주택"
                met={exemptionConditions.isSingleHousehold}
              />
              <ConditionCheck
                label="2년 이상 보유"
                met={exemptionConditions.holdingOver2Years}
                detail={`${saleResult.holdingYears}년 ${saleResult.holdingMonths}개월 보유`}
              />
              <ConditionCheck
                label="2년 이상 거주"
                met={exemptionConditions.residenceOver2Years}
                detail={`${currentProperty.residenceYears}년 ${currentProperty.residenceMonths}개월 거주`}
              />
              <ConditionCheck
                label="실거래가 12억 이하"
                met={exemptionConditions.priceUnder12Billion}
                detail={formatPriceWon(currentProperty.currentValue || 0)}
              />
            </div>
          </div>

          {/* Tax Result */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">양도소득세</span>
              <span
                className={`text-xl font-bold ${
                  isTaxExempt ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {isTaxExempt ? '0원 (비과세)' : formatPriceWon(saleResult.capitalGainsTax)}
              </span>
            </div>
            {isTaxExempt && (
              <p className="text-sm text-emerald-600 mt-1">
                ✨ 1세대 1주택 비과세 요건을 충족하여 양도소득세가 면제됩니다
              </p>
            )}
          </div>

          {/* If not exempt, show calculation details */}
          {!isTaxExempt && saleResult.capitalGainsTax > 0 && (
            <ResultSection title="양도소득세 계산 상세">
              <ResultRow label="양도차익" value={saleResult.capitalGain} />
              <ResultRow
                label={`장기보유특별공제 (${formatPercent(saleResult.longTermDeductionRate)})`}
                value={saleResult.longTermDeduction}
                isSubtraction
              />
              <ResultRow
                label="양도소득세"
                value={saleResult.capitalGainsTax}
                isTotal
              />
            </ResultSection>
          )}
        </CardContent>
      </Card>

      {/* Sale Cost Summary */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            📊 매도 비용 요약
          </h3>

          <ResultSection title="비용 내역">
            <ResultRow
              label="양도소득세"
              value={saleResult.capitalGainsTax}
              hint={isTaxExempt ? '비과세' : undefined}
            />
            <ResultRow
              label={`중개수수료 (${formatPercent(saleResult.brokerageFee.rate)})`}
              value={saleResult.brokerageFee.total}
              hint="VAT 포함"
            />
            <ResultRow
              label="총 매도 비용"
              value={saleResult.capitalGainsTax + saleResult.brokerageFee.total}
              isTotal
            />
          </ResultSection>
        </CardContent>
      </Card>

      {/* Net Proceeds */}
      <TotalResultCard
        title="💰 예상 실수령액"
        amount={saleResult.netProceeds}
        description={`매도가 ${formatPriceWon(currentProperty.currentValue || 0)} - 비용`}
        variant="success"
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          ← 이전
        </Button>
        <Button onClick={nextStep} size="lg">
          다음 단계 →
        </Button>
      </div>
    </div>
  );
}
