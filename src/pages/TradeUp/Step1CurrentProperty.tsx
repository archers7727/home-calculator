import React from 'react';
import {
  Card,
  CardContent,
  Button,
  PriceInput,
  Input,
  Select,
  Checkbox,
} from '../../components/ui';
import { useTradeUpStore } from '../../store';
import { REGIONS, DISTRICTS, formatArea, formatPriceWon } from '../../constants';
import { differenceInMonths } from 'date-fns';

export function Step1CurrentProperty() {
  const { currentProperty, updateCurrentProperty, nextStep } = useTradeUpStore();

  const regionOptions = REGIONS.map((r) => ({ value: r, label: r }));
  const districtOptions = (DISTRICTS[currentProperty.region || ''] || []).map((d) => ({
    value: d,
    label: d,
  }));

  // 보유 기간 계산
  const holdingMonths = currentProperty.purchaseDate
    ? differenceInMonths(new Date(), currentProperty.purchaseDate)
    : 0;
  const holdingYears = Math.floor(holdingMonths / 12);
  const holdingMonthsRemainder = holdingMonths % 12;

  // 양도차익 계산
  const capitalGain =
    (currentProperty.currentValue || 0) - (currentProperty.purchasePrice || 0);

  const handleDateChange = (year: number, month: number) => {
    if (year && month) {
      updateCurrentProperty({
        purchaseDate: new Date(year, month - 1, 15),
      });
    }
  };

  const purchaseYear = currentProperty.purchaseDate?.getFullYear() || 2021;
  const purchaseMonth = currentProperty.purchaseDate
    ? currentProperty.purchaseDate.getMonth() + 1
    : 3;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">
            🏠 현재 보유 주택 정보
          </h3>

          {/* Purchase Price */}
          <PriceInput
            label="매입 가격 (취득 당시)"
            value={currentProperty.purchasePrice || 0}
            onChange={(value) => updateCurrentProperty({ purchasePrice: value })}
            unit="eok"
          />

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              매입 일자
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={purchaseYear}
                  onChange={(e) =>
                    handleDateChange(parseInt(e.target.value), purchaseMonth)
                  }
                  suffix="년"
                  min={1990}
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={purchaseMonth}
                  onChange={(e) =>
                    handleDateChange(purchaseYear, parseInt(e.target.value))
                  }
                  suffix="월"
                  min={1}
                  max={12}
                />
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              → 보유 기간: {holdingYears}년 {holdingMonthsRemainder}개월
            </p>
          </div>

          {/* Current Value */}
          <div>
            <PriceInput
              label="현재 예상 시세 (매도 희망가)"
              value={currentProperty.currentValue || 0}
              onChange={(value) => updateCurrentProperty({ currentValue: value })}
              unit="eok"
            />
            {capitalGain > 0 && (
              <p className="text-sm text-emerald-600 mt-1">
                → 예상 양도차익: {formatPriceWon(capitalGain)}
              </p>
            )}
          </div>

          {/* Area */}
          <div>
            <Input
              label="전용면적"
              type="number"
              value={currentProperty.area || ''}
              onChange={(e) =>
                updateCurrentProperty({ area: parseFloat(e.target.value) || 0 })
              }
              suffix="㎡"
            />
            {currentProperty.area && (
              <p className="text-sm text-slate-500 mt-1">
                {formatArea(currentProperty.area)}
              </p>
            )}
          </div>

          {/* Region */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="지역 (시/도)"
              options={regionOptions}
              value={currentProperty.region || ''}
              onChange={(e) => {
                updateCurrentProperty({
                  region: e.target.value,
                  district: '',
                });
              }}
              placeholder="선택하세요"
            />
            <Select
              label="지역 (구/군)"
              options={districtOptions}
              value={currentProperty.district || ''}
              onChange={(e) =>
                updateCurrentProperty({ district: e.target.value })
              }
              placeholder="선택하세요"
              disabled={!currentProperty.region || districtOptions.length === 0}
            />
          </div>
        </CardContent>
      </Card>

      {/* Residence Info */}
      <Card>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">🏡 거주 정보</h3>

          {/* Residence Period */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              실거주 기간
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={currentProperty.residenceYears ?? ''}
                  onChange={(e) =>
                    updateCurrentProperty({
                      residenceYears: parseInt(e.target.value) || 0,
                    })
                  }
                  suffix="년"
                  min={0}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={currentProperty.residenceMonths ?? ''}
                  onChange={(e) =>
                    updateCurrentProperty({
                      residenceMonths: parseInt(e.target.value) || 0,
                    })
                  }
                  suffix="개월"
                  min={0}
                  max={11}
                />
              </div>
            </div>
          </div>

          {/* Single Household */}
          <Checkbox
            label="1세대 1주택"
            hint="세대 내 다른 주택이 없음"
            checked={currentProperty.isSingleHousehold || false}
            onChange={(checked) =>
              updateCurrentProperty({ isSingleHousehold: checked })
            }
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={nextStep} size="lg">
          다음 단계 →
        </Button>
      </div>
    </div>
  );
}
