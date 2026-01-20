import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  PriceInput,
  Select,
  RadioGroup,
  Checkbox,
  ResultSection,
  ResultRow,
  TotalResultCard,
} from '../../components/ui';
import { calculateAcquisitionTax } from '../../calculators';
import { HousingInfo, BuyerInfo, AcquisitionTaxResult } from '../../types';
import { REGIONS, DISTRICTS, ADJUSTMENT_AREAS, formatPercent, formatPriceWon } from '../../constants';
import { useHistoryStore } from '../../store';

export function AcquisitionTaxCalculator() {
  const [price, setPrice] = useState(800_000_000);
  const [region, setRegion] = useState('서울특별시');
  const [district, setDistrict] = useState('강남구');
  const [houseCount, setHouseCount] = useState<0 | 1 | 2>(0);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [income, setIncome] = useState(70_000_000);
  const [area, setArea] = useState(84);
  const [result, setResult] = useState<AcquisitionTaxResult | null>(null);
  const [saved, setSaved] = useState(false);
  const { addItem } = useHistoryStore();

  const regionOptions = REGIONS.map((r) => ({ value: r, label: r }));
  const districtOptions = (DISTRICTS[region] || []).map((d) => ({
    value: d,
    label: d,
  }));

  const isAdjustmentArea = ADJUSTMENT_AREAS.includes(region as any);

  const houseCountOptions = [
    { value: 0, label: '무주택' },
    { value: 1, label: '1주택' },
    { value: 2, label: '2주택+' },
  ];

  useEffect(() => {
    const housing: HousingInfo = {
      price,
      area,
      region,
      district,
      isAdjustmentArea,
      type: 'apartment',
    };

    const buyer: BuyerInfo = {
      houseCount: houseCount as 0 | 1 | 2 | 3,
      isFirstTime: houseCount === 0 && isFirstTime,
      isNewlywed: false,
      childCount: 0,
      hasBabyPlan: false,
      income,
      spouseIncome: 0,
    };

    const calcResult = calculateAcquisitionTax(housing, buyer);
    setResult(calcResult);
    setSaved(false);
  }, [price, region, district, houseCount, isFirstTime, income, area, isAdjustmentArea]);

  const handleSave = () => {
    if (!result) return;
    addItem({
      type: 'acquisition-tax',
      data: {
        propertyPrice: price,
        houseCount: houseCount === 2 ? 3 : houseCount,
        totalTax: result.total,
        effectiveRate: result.baseRate,
      },
    });
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">취득세 계산기</h1>
        <p className="text-slate-600 mt-1">
          주택 구입 시 납부해야 하는 취득세를 계산합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">주택 정보</h3>

            <PriceInput
              label="매매가격"
              value={price}
              onChange={setPrice}
              unit="eok"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="지역 (시/도)"
                options={regionOptions}
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setDistrict('');
                }}
              />
              <Select
                label="지역 (구/군)"
                options={districtOptions}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={districtOptions.length === 0}
              />
            </div>

            {isAdjustmentArea && (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                ⚠️ 조정대상지역
              </div>
            )}

            <RadioGroup
              label="현재 주택 보유 수"
              options={houseCountOptions}
              value={houseCount}
              onChange={(v) => setHouseCount(v as 0 | 1 | 2)}
            />

            {houseCount === 0 && (
              <>
                <Checkbox
                  label="생애최초 주택 구입"
                  hint="본인/배우자 모두 주택 소유 이력 없음"
                  checked={isFirstTime}
                  onChange={setIsFirstTime}
                />

                {isFirstTime && (
                  <PriceInput
                    label="부부 합산 연소득"
                    value={income}
                    onChange={setIncome}
                    unit="man"
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <TotalResultCard
              title="납부할 취득세"
              amount={result.total}
              description={`세율 ${formatPercent(result.baseRate)}`}
            />

            <Card>
              <CardContent>
                <ResultSection title="세금 상세">
                  <ResultRow
                    label={`취득세 (${formatPercent(result.baseRate)})`}
                    value={result.baseTax}
                  />
                  {result.ruralTax > 0 && (
                    <ResultRow label="농어촌특별세" value={result.ruralTax} />
                  )}
                  <ResultRow label="지방교육세" value={result.educationTax} />
                  {result.reduction > 0 && (
                    <ResultRow
                      label={`✨ ${result.reductionReason}`}
                      value={result.reduction}
                      isSubtraction
                    />
                  )}
                  <ResultRow label="총 납부액" value={result.total} isTotal />
                </ResultSection>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h4 className="font-semibold text-slate-800 mb-2">참고사항</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• 취득세 신고: 잔금일로부터 60일 이내</li>
                  <li>• 농어촌특별세: 전용면적 85㎡ 초과 시 부과</li>
                  <li>• 생애최초 감면: 소득 7천만원 이하, 12억 이하 주택</li>
                </ul>
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
