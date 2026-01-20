import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  PriceInput,
  Input,
  Checkbox,
  ResultSection,
  ResultRow,
  TotalResultCard,
  ConditionCheck,
} from '../../components/ui';
import { calculateSaleResult } from '../../calculators';
import { PropertyForSale, SaleCalculation } from '../../types';
import { formatPercent, formatPriceWon } from '../../constants';
import { useHistoryStore } from '../../store';

export function CapitalGainsTaxCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(400_000_000);
  const [salePrice, setSalePrice] = useState(600_000_000);
  const [purchaseYear, setPurchaseYear] = useState(2021);
  const [purchaseMonth, setPurchaseMonth] = useState(3);
  const [residenceYears, setResidenceYears] = useState(4);
  const [residenceMonths, setResidenceMonths] = useState(10);
  const [isSingleHousehold, setIsSingleHousehold] = useState(true);
  const [result, setResult] = useState<SaleCalculation | null>(null);
  const [saved, setSaved] = useState(false);
  const { addItem } = useHistoryStore();

  useEffect(() => {
    const property: PropertyForSale = {
      purchasePrice,
      purchaseDate: new Date(purchaseYear, purchaseMonth - 1, 15),
      currentValue: salePrice,
      area: 84,
      region: '서울특별시',
      district: '강남구',
      residenceYears,
      residenceMonths,
      isSingleHousehold,
    };

    const calcResult = calculateSaleResult(property);
    setResult(calcResult);
    setSaved(false);
  }, [purchasePrice, salePrice, purchaseYear, purchaseMonth, residenceYears, residenceMonths, isSingleHousehold]);

  const capitalGain = salePrice - purchasePrice;

  const handleSave = () => {
    if (!result) return;
    addItem({
      type: 'capital-gains-tax',
      data: {
        salePrice,
        purchasePrice,
        capitalGain,
        tax: result.capitalGainsTax,
        isTaxExempt: result.isTaxExempt,
      },
    });
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">양도소득세 계산기</h1>
        <p className="text-slate-600 mt-1">
          주택 매도 시 양도소득세를 계산하고 비과세 요건을 확인합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">주택 정보</h3>

            <PriceInput
              label="매입가격"
              value={purchasePrice}
              onChange={setPurchasePrice}
              unit="eok"
            />

            <PriceInput
              label="매도가격"
              value={salePrice}
              onChange={setSalePrice}
              unit="eok"
            />

            {capitalGain > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-slate-600">양도차익</span>
                  <span className="font-bold text-blue-600">{formatPriceWon(capitalGain)}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                취득일
              </label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={purchaseYear}
                  onChange={(e) => setPurchaseYear(parseInt(e.target.value) || 2020)}
                  suffix="년"
                  min={1990}
                  max={new Date().getFullYear()}
                />
                <Input
                  type="number"
                  value={purchaseMonth}
                  onChange={(e) => setPurchaseMonth(parseInt(e.target.value) || 1)}
                  suffix="월"
                  min={1}
                  max={12}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                실거주 기간
              </label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={residenceYears}
                  onChange={(e) => setResidenceYears(parseInt(e.target.value) || 0)}
                  suffix="년"
                  min={0}
                />
                <Input
                  type="number"
                  value={residenceMonths}
                  onChange={(e) => setResidenceMonths(parseInt(e.target.value) || 0)}
                  suffix="개월"
                  min={0}
                  max={11}
                />
              </div>
            </div>

            <Checkbox
              label="1세대 1주택"
              hint="세대 내 다른 주택 없음"
              checked={isSingleHousehold}
              onChange={setIsSingleHousehold}
            />
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <TotalResultCard
              title="양도소득세"
              amount={result.capitalGainsTax}
              description={result.isTaxExempt ? '비과세 적용' : undefined}
              variant={result.isTaxExempt ? 'success' : 'primary'}
            />

            {/* Tax Exemption Check */}
            <Card>
              <CardContent>
                <div
                  className={`p-4 rounded-lg ${
                    result.isTaxExempt
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-amber-50 border border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{result.isTaxExempt ? '✅' : '⚠️'}</span>
                    <span
                      className={`font-bold ${
                        result.isTaxExempt ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      1세대 1주택 비과세 {result.isTaxExempt ? '적용' : '미적용'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <ConditionCheck
                      label="1세대 1주택"
                      met={result.exemptionConditions.isSingleHousehold}
                    />
                    <ConditionCheck
                      label="2년 이상 보유"
                      met={result.exemptionConditions.holdingOver2Years}
                      detail={`${result.holdingYears}년 ${result.holdingMonths}개월`}
                    />
                    <ConditionCheck
                      label="2년 이상 거주"
                      met={result.exemptionConditions.residenceOver2Years}
                      detail={`${residenceYears}년 ${residenceMonths}개월`}
                    />
                    <ConditionCheck
                      label="실거래가 12억 이하"
                      met={result.exemptionConditions.priceUnder12Billion}
                      detail={formatPriceWon(salePrice)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Details */}
            {!result.isTaxExempt && result.capitalGainsTax > 0 && (
              <Card>
                <CardContent>
                  <ResultSection title="계산 상세">
                    <ResultRow label="양도차익" value={capitalGain} />
                    <ResultRow
                      label={`장기보유특별공제 (${formatPercent(result.longTermDeductionRate)})`}
                      value={result.longTermDeduction}
                      isSubtraction
                    />
                    <ResultRow
                      label="양도소득세"
                      value={result.capitalGainsTax}
                      isTotal
                    />
                  </ResultSection>
                </CardContent>
              </Card>
            )}

            {/* Net Proceeds */}
            <Card>
              <CardContent>
                <ResultSection title="매도 비용 요약">
                  <ResultRow label="매도가격" value={salePrice} />
                  <ResultRow
                    label="양도소득세"
                    value={result.capitalGainsTax}
                    isSubtraction
                  />
                  <ResultRow
                    label="중개수수료"
                    value={result.brokerageFee.total}
                    isSubtraction
                  />
                  <ResultRow
                    label="실수령액"
                    value={result.netProceeds}
                    isTotal
                    isHighlight
                  />
                </ResultSection>
              </CardContent>
            </Card>

            <Button
              onClick={handleSave}
              disabled={saved}
              className="w-full"
              variant={saved ? 'secondary' : 'primary'}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  저장됨
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  계산 결과 저장
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
