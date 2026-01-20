import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  PriceInput,
  Input,
  Select,
  RadioGroup,
  Slider,
} from '../../components/ui';
import { useCalculatorStore } from '../../store';
import { REGIONS, DISTRICTS, ADJUSTMENT_AREAS, formatArea } from '../../constants';
import { HousingType } from '../../types';

export function Step1Housing() {
  const { housing, updateHousing, nextStep } = useCalculatorStore();

  const housingTypes = [
    { value: 'apartment', label: '아파트' },
    { value: 'villa', label: '빌라' },
    { value: 'officetel', label: '오피스텔' },
  ];

  const regionOptions = REGIONS.map((r) => ({ value: r, label: r }));
  const districtOptions = (DISTRICTS[housing.region || ''] || []).map((d) => ({
    value: d,
    label: d,
  }));

  // Check if adjustment area
  useEffect(() => {
    const isAdjustment = ADJUSTMENT_AREAS.includes(housing.region as typeof ADJUSTMENT_AREAS[number]);
    if (housing.isAdjustmentArea !== isAdjustment) {
      updateHousing({ isAdjustmentArea: isAdjustment });
    }
  }, [housing.region]);

  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">
            🏠 구매할 주택 정보
          </h3>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              매매가격
            </label>
            <PriceInput
              value={housing.price || 0}
              onChange={(value) => updateHousing({ price: value })}
              unit="eok"
              placeholder="매매가격 입력"
            />
            <Slider
              value={housing.price || 0}
              onChange={(value) => updateHousing({ price: value })}
              min={100_000_000}
              max={2_000_000_000}
              step={100_000_000}
              unit="eok"
              showValue={false}
            />
          </div>

          {/* Housing Type */}
          <RadioGroup
            label="주택 유형"
            options={housingTypes}
            value={housing.type || 'apartment'}
            onChange={(value) => updateHousing({ type: value as HousingType })}
          />

          {/* Area */}
          <div>
            <Input
              label="전용면적"
              type="number"
              value={housing.area || ''}
              onChange={(e) =>
                updateHousing({ area: parseFloat(e.target.value) || 0 })
              }
              suffix="㎡"
              placeholder="84"
            />
            {housing.area && (
              <p className="text-sm text-slate-500 mt-1">
                {formatArea(housing.area)}
              </p>
            )}
          </div>

          {/* Region */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="지역 (시/도)"
              options={regionOptions}
              value={housing.region || ''}
              onChange={(e) => {
                updateHousing({
                  region: e.target.value,
                  district: '',
                });
              }}
              placeholder="선택하세요"
            />
            <Select
              label="지역 (구/군)"
              options={districtOptions}
              value={housing.district || ''}
              onChange={(e) => updateHousing({ district: e.target.value })}
              placeholder="선택하세요"
              disabled={!housing.region || districtOptions.length === 0}
            />
          </div>

          {housing.isAdjustmentArea && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600">⚠️</span>
              <span className="text-sm text-amber-800">조정대상지역입니다</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={handleNext} size="lg">
          다음 단계 →
        </Button>
      </div>
    </div>
  );
}
