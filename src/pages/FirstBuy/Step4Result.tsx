import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  ResultSection,
  ResultRow,
  TotalResultCard,
} from '../../components/ui';
import { useCalculatorStore } from '../../store';
import { calculateTotalCost, getRecommendedLoanCombination } from '../../calculators';
import { HousingInfo, BuyerInfo } from '../../types';
import { formatPriceWon, formatPercent } from '../../constants';
import { Download, RefreshCw } from 'lucide-react';

export function Step4Result() {
  const navigate = useNavigate();
  const {
    housing,
    buyer,
    loans,
    cost,
    setCost,
    availableCapital,
    prevStep,
    reset,
  } = useCalculatorStore();

  // Calculate total cost
  useEffect(() => {
    if (housing.price) {
      const calculatedCost = calculateTotalCost(
        housing as HousingInfo,
        buyer as BuyerInfo
      );
      setCost(calculatedCost);
    }
  }, [housing, buyer]);

  if (!cost) {
    return <div>계산 중...</div>;
  }

  // Loan recommendation
  const targetAmount = Math.max(0, cost.total - availableCapital);
  const recommendation = getRecommendedLoanCombination(loans, targetAmount);
  const additionalNeeded = Math.max(
    0,
    cost.total - availableCapital - recommendation.totalAmount
  );

  const handleSavePDF = async () => {
    const { generateFirstBuyPDF } = await import('../../utils/pdfGenerator');
    generateFirstBuyPDF({
      housing: housing as HousingInfo,
      buyer: buyer as BuyerInfo,
      cost,
      loans,
      availableCapital,
      recommendation,
    });
  };

  const handleReset = () => {
    reset();
    navigate('/first-buy');
  };

  return (
    <div className="space-y-6">
      {/* Total Amount */}
      <TotalResultCard
        title="💰 총 필요 금액"
        amount={cost.total}
        description={`매매가 ${formatPriceWon(housing.price || 0)} + 부대비용 ${formatPriceWon(cost.totalAdditional)}`}
      />

      {/* Cost Breakdown */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            📋 비용 상세 내역
          </h3>

          {/* Housing Price */}
          <ResultSection title="주택 가격">
            <ResultRow label="매매가" value={housing.price || 0} />
          </ResultSection>

          {/* Taxes */}
          <ResultSection title="세금">
            <ResultRow
              label={`취득세 (${formatPercent(cost.acquisitionTax.baseRate)})`}
              value={cost.acquisitionTax.baseTax}
            />
            {cost.acquisitionTax.ruralTax > 0 && (
              <ResultRow
                label="농어촌특별세"
                value={cost.acquisitionTax.ruralTax}
              />
            )}
            <ResultRow
              label="지방교육세"
              value={cost.acquisitionTax.educationTax}
            />
            {cost.acquisitionTax.reduction > 0 && (
              <ResultRow
                label={`✨ ${cost.acquisitionTax.reductionReason}`}
                value={cost.acquisitionTax.reduction}
                isSubtraction
              />
            )}
            <ResultRow
              label="세금 소계"
              value={cost.acquisitionTax.total}
              isTotal
            />
          </ResultSection>

          {/* Additional Costs */}
          <ResultSection title="부대비용">
            <ResultRow
              label="중개수수료 (VAT 포함)"
              value={cost.brokerageFee.total}
              hint={`요율 ${formatPercent(cost.brokerageFee.rate)}`}
            />
            <ResultRow label="법무사 비용" value={cost.lawyerFee} />
            <ResultRow label="국민주택채권 할인" value={cost.housingBond} />
            <ResultRow label="인지세" value={cost.stampDuty} />
            <ResultRow label="이사비 (예상)" value={cost.movingCost} />
          </ResultSection>
        </CardContent>
      </Card>

      {/* Funding Plan */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            📊 자금 조달 계획
          </h3>

          {/* Visual Bar */}
          <div className="space-y-2">
            <div className="h-8 rounded-lg overflow-hidden flex">
              <div
                className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium"
                style={{
                  width: `${(availableCapital / cost.total) * 100}%`,
                }}
              >
                {availableCapital >= cost.total * 0.1 && '자기자본'}
              </div>
              <div
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                style={{
                  width: `${(recommendation.totalAmount / cost.total) * 100}%`,
                }}
              >
                {recommendation.totalAmount >= cost.total * 0.1 && '대출'}
              </div>
              {additionalNeeded > 0 && (
                <div
                  className="bg-amber-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{
                    width: `${(additionalNeeded / cost.total) * 100}%`,
                  }}
                >
                  {additionalNeeded >= cost.total * 0.05 && '추가필요'}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <ResultRow label="총 필요 금액" value={cost.total} />
            <ResultRow label="자기자본" value={availableCapital} />
            <ResultRow label="대출" value={recommendation.totalAmount} />
            <ResultRow
              label="추가 필요"
              value={additionalNeeded}
              isTotal
              isHighlight={additionalNeeded > 0}
            />
          </div>

          {additionalNeeded > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                ⚠️ 자기자본 또는 대출 금액을 조정해주세요
              </p>
            </div>
          )}

          {recommendation.monthlyPayment > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">예상 월 상환액</span>
                <span className="font-bold text-blue-600">
                  약 {formatPriceWon(recommendation.monthlyPayment)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                (원리금균등, 30년 기준)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={handleSavePDF}
          className="flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          PDF 저장
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={handleReset}
          className="flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          다시 계산
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-start">
        <Button variant="ghost" onClick={prevStep}>
          ← 이전 단계
        </Button>
      </div>
    </div>
  );
}
