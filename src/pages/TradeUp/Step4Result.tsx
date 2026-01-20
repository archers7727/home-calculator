import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  ResultSection,
  ResultRow,
  TotalResultCard,
  PriceInput,
} from '../../components/ui';
import { useTradeUpStore } from '../../store';
import {
  calculateTotalCost,
  calculateAllLoans,
  getRecommendedLoanCombination,
} from '../../calculators';
import { HousingInfo, BuyerInfo, CostCalculation } from '../../types';
import { formatPriceWon, formatPercent } from '../../constants';
import { Download, RefreshCw, ArrowRight } from 'lucide-react';

export function Step4Result() {
  const navigate = useNavigate();
  const {
    currentProperty,
    saleResult,
    newProperty,
    buyer,
    purchaseCost,
    setPurchaseCost,
    loans,
    setLoans,
    prevStep,
    reset,
  } = useTradeUpStore();

  const [alternativePrice, setAlternativePrice] = useState(newProperty.price || 0);
  const [alternativeCost, setAlternativeCost] = useState<CostCalculation | null>(null);

  // Calculate purchase cost for new property
  useEffect(() => {
    if (newProperty.price) {
      const cost = calculateTotalCost(
        newProperty as HousingInfo,
        { ...buyer, houseCount: 0 } as BuyerInfo // 일시적 2주택 → 1주택 세율
      );
      setPurchaseCost(cost);

      // Calculate loans
      const calculatedLoans = calculateAllLoans(
        newProperty as HousingInfo,
        buyer as BuyerInfo
      );
      setLoans(calculatedLoans);
    }
  }, [newProperty, buyer, setPurchaseCost, setLoans]);

  // Calculate alternative simulation
  useEffect(() => {
    if (alternativePrice && alternativePrice !== newProperty.price) {
      const altCost = calculateTotalCost(
        { ...newProperty, price: alternativePrice } as HousingInfo,
        { ...buyer, houseCount: 0 } as BuyerInfo
      );
      setAlternativeCost(altCost);
    } else {
      setAlternativeCost(null);
    }
  }, [alternativePrice, newProperty, buyer]);

  if (!saleResult || !purchaseCost) {
    return <div className="text-center py-10">계산 중...</div>;
  }

  // Core calculations
  const netProceeds = saleResult.netProceeds;
  const totalPurchaseCost = purchaseCost.total;
  const additionalFundsNeeded = totalPurchaseCost - netProceeds;

  // Loan recommendation
  const targetLoan = Math.max(0, additionalFundsNeeded);
  const recommendation = getRecommendedLoanCombination(loans, targetLoan);
  const requiredCapital = Math.max(0, additionalFundsNeeded - recommendation.totalAmount);

  // Alternative calculations
  const altAdditionalFunds = alternativeCost
    ? alternativeCost.total - netProceeds
    : 0;
  const altRecommendation = alternativeCost
    ? getRecommendedLoanCombination(loans, Math.max(0, altAdditionalFunds))
    : null;
  const altRequiredCapital = altRecommendation
    ? Math.max(0, altAdditionalFunds - altRecommendation.totalAmount)
    : 0;

  const handleSavePDF = async () => {
    const { generateTradeUpPDF } = await import('../../utils/pdfGenerator');
    generateTradeUpPDF({
      currentProperty: currentProperty as any,
      saleResult,
      newProperty: newProperty as HousingInfo,
      purchaseCost,
      loans,
      recommendation,
      additionalFundsNeeded,
      requiredCapital,
    });
  };

  const handleReset = () => {
    reset();
    navigate('/trade-up');
  };

  // Preset alternatives
  const alternatives = [-200_000_000, -100_000_000, 100_000_000, 200_000_000].map(
    (delta) => {
      const price = (newProperty.price || 0) + delta;
      const cost = calculateTotalCost(
        { ...newProperty, price } as HousingInfo,
        { ...buyer, houseCount: 0 } as BuyerInfo
      );
      const addFunds = cost.total - netProceeds;
      const rec = getRecommendedLoanCombination(loans, Math.max(0, addFunds));
      return {
        price,
        additionalFunds: addFunds,
        loanAvailable: rec.totalAmount,
        requiredCapital: Math.max(0, addFunds - rec.totalAmount),
      };
    }
  ).filter((alt) => alt.price > 0);

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
          <h2 className="text-lg font-medium mb-2">🔄 갈아타기 시뮬레이션 결과</h2>
        </div>
        <CardContent className="p-6">
          {/* Side by Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Sale Side */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📤</span>
                <span className="font-semibold text-slate-800">현재 집 매도</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {formatPriceWon(currentProperty.currentValue || 0)}
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">양도세</span>
                  <span className={saleResult.isTaxExempt ? 'text-emerald-600' : ''}>
                    {saleResult.isTaxExempt ? '0원 (비과세)' : formatPriceWon(saleResult.capitalGainsTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">중개료</span>
                  <span>{formatPriceWon(saleResult.brokerageFee.total)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 mt-1 font-medium">
                  <span>실수령</span>
                  <span className="text-emerald-600">{formatPriceWon(netProceeds)}</span>
                </div>
              </div>
            </div>

            {/* Purchase Side */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📥</span>
                <span className="font-semibold text-slate-800">새 집 구매</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {formatPriceWon(newProperty.price || 0)}
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">취득세</span>
                  <span>{formatPriceWon(purchaseCost.acquisitionTax.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">중개료</span>
                  <span>{formatPriceWon(purchaseCost.brokerageFee.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">기타</span>
                  <span>
                    {formatPriceWon(
                      purchaseCost.lawyerFee +
                        purchaseCost.housingBond +
                        purchaseCost.stampDuty
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1 mt-1 font-medium">
                  <span>총비용</span>
                  <span className="text-blue-600">{formatPriceWon(totalPurchaseCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Funds Needed */}
          <div
            className={`p-6 rounded-xl text-center ${
              additionalFundsNeeded > 0
                ? 'bg-amber-50 border-2 border-amber-300'
                : 'bg-emerald-50 border-2 border-emerald-300'
            }`}
          >
            <p className="text-sm text-slate-600 mb-1">💰 추가 필요 금액</p>
            <p
              className={`text-3xl font-bold ${
                additionalFundsNeeded > 0 ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {additionalFundsNeeded > 0
                ? formatPriceWon(additionalFundsNeeded)
                : '없음 (여유 자금 발생)'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              새 집 총비용 {formatPriceWon(totalPurchaseCost)} - 매도 실수령{' '}
              {formatPriceWon(netProceeds)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Funding Plan */}
      {additionalFundsNeeded > 0 && (
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              📊 자금 조달 방안
            </h3>

            <ResultSection title="대출 가능 금액 (예상)">
              {recommendation.loans.map((loan) => (
                <ResultRow
                  key={loan.type}
                  label={loan.name}
                  value={loan.limit}
                  hint={`금리 ${formatPercent(loan.rate)}`}
                />
              ))}
              <ResultRow
                label="대출 가능 총액"
                value={recommendation.totalAmount}
                isTotal
              />
            </ResultSection>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-slate-600 mb-1">대출 가능</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatPriceWon(recommendation.totalAmount)}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg text-center ${
                  requiredCapital > 0 ? 'bg-amber-50' : 'bg-emerald-50'
                }`}
              >
                <p className="text-sm text-slate-600 mb-1">필요 자기자본</p>
                <p
                  className={`text-xl font-bold ${
                    requiredCapital > 0 ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {requiredCapital > 0 ? formatPriceWon(requiredCapital) : '0원'}
                </p>
              </div>
            </div>

            {recommendation.monthlyPayment > 0 && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">예상 월 상환액</span>
                  <span className="font-bold">
                    약 {formatPriceWon(recommendation.monthlyPayment)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">(원리금균등, 30년 기준)</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Alternative Simulation */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            🎯 다른 가격으로 시뮬레이션
          </h3>

          <div className="p-4 bg-slate-50 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              "만약 다른 가격이라면?"
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <PriceInput
                  value={alternativePrice}
                  onChange={setAlternativePrice}
                  unit="eok"
                />
              </div>
            </div>

            {alternativeCost && alternativePrice !== newProperty.price && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <span>추가 필요:</span>
                  <span className="font-bold text-blue-600">
                    {formatPriceWon(altAdditionalFunds)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <span>필요 자기자본:</span>
                  <span
                    className={`font-bold ${
                      altRequiredCapital > 0 ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {altRequiredCapital > 0
                      ? formatPriceWon(altRequiredCapital)
                      : '0원 (대출로 충당 가능)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Preset Alternatives Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">가격</th>
                  <th className="text-right py-2 px-2">추가필요</th>
                  <th className="text-right py-2 px-2">대출가능</th>
                  <th className="text-right py-2 px-2">자기자본</th>
                </tr>
              </thead>
              <tbody>
                {alternatives.map((alt) => (
                  <tr
                    key={alt.price}
                    className={`border-b ${
                      alt.price === newProperty.price ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="py-2 px-2 font-medium">
                      {formatPriceWon(alt.price)}
                    </td>
                    <td className="text-right py-2 px-2">
                      {formatPriceWon(alt.additionalFunds)}
                    </td>
                    <td className="text-right py-2 px-2">
                      {formatPriceWon(alt.loanAvailable)}
                    </td>
                    <td
                      className={`text-right py-2 px-2 font-medium ${
                        alt.requiredCapital > 0
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {alt.requiredCapital > 0
                        ? formatPriceWon(alt.requiredCapital)
                        : '0원'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            ⚠️ 유의사항
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                일시적 2주택: 신규 취득 후 <strong>3년 내</strong> 기존 주택 매도 필수
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                취득세 신고: 잔금일로부터 <strong>60일 이내</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>금리 변동에 따라 대출 조건이 변경될 수 있습니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>본 계산은 참고용이며, 실제 세금은 다를 수 있습니다</span>
            </li>
          </ul>
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
          처음부터
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
