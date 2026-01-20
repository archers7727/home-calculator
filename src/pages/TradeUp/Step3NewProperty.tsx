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
  Checkbox,
} from '../../components/ui';
import { useTradeUpStore } from '../../store';
import { REGIONS, DISTRICTS, ADJUSTMENT_AREAS, formatArea } from '../../constants';
import { HousingType } from '../../types';

export function Step3NewProperty() {
  const {
    newProperty,
    updateNewProperty,
    isTemporary2House,
    setIsTemporary2House,
    nextStep,
    prevStep,
  } = useTradeUpStore();

  const housingTypes = [
    { value: 'apartment', label: '아파트' },
    { value: 'villa', label: '빌라' },
    { value: 'officetel', label: '오피스텔' },
  ];

  const regionOptions = REGIONS.map((r) => ({ value: r, label: r }));
  const districtOptions = (DISTRICTS[newProperty.region || ''] || []).map((d) => ({
    value: d,
    label: d,
  }));

  // Check if adjustment area
  useEffect(() => {
    const isAdjustment = ADJUSTMENT_AREAS.includes(
      newProperty.region as (typeof ADJUSTMENT_AREAS)[number]
    );
    if (newProperty.isAdjustmentArea !== isAdjustment) {
      updateNewProperty({ isAdjustmentArea: isAdjustment });
    }
  }, [newProperty.region]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">
            🏠 새로 구매할 주택 정보
          </h3>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              희망 매매가격
            </label>
            <PriceInput
              value={newProperty.price || 0}
              onChange={(value) => updateNewProperty({ price: value })}
              unit="eok"
              placeholder="매매가격 입력"
            />
            <Slider
              value={newProperty.price || 0}
              onChange={(value) => updateNewProperty({ price: value })}
              min={500_000_000}
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
            value={newProperty.type || 'apartment'}
            onChange={(value) => updateNewProperty({ type: value as HousingType })}
          />

          {/* Area */}
          <div>
            <Input
              label="전용면적"
              type="number"
              value={newProperty.area || ''}
              onChange={(e) =>
                updateNewProperty({ area: parseFloat(e.target.value) || 0 })
              }
              suffix="㎡"
            />
            {newProperty.area && (
              <p className="text-sm text-slate-500 mt-1">
                {formatArea(newProperty.area)}
              </p>
            )}
          </div>

          {/* Region */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="지역 (시/도)"
              options={regionOptions}
              value={newProperty.region || ''}
              onChange={(e) => {
                updateNewProperty({
                  region: e.target.value,
                  district: '',
                });
              }}
              placeholder="선택하세요"
            />
            <Select
              label="지역 (구/군)"
              options={districtOptions}
              value={newProperty.district || ''}
              onChange={(e) => updateNewProperty({ district: e.target.value })}
              placeholder="선택하세요"
              disabled={!newProperty.region || districtOptions.length === 0}
            />
          </div>

          {newProperty.isAdjustmentArea && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600">⚠️</span>
              <span className="text-sm text-amber-800">조정대상지역입니다</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Temporary 2-house */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            🔄 일시적 2주택 특례 적용 여부
          </h3>

          <Checkbox
            label="신규 주택 취득 후 3년 내 기존 주택 매도 예정"
            checked={isTemporary2House}
            onChange={setIsTemporary2House}
          />

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ 일시적 2주택 특례</strong>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              신규 주택 취득 후 3년 내에 기존 주택을 양도하면 1주택 세율이 적용됩니다.
              취득세 및 양도소득세 중과를 피할 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          ← 이전
        </Button>
        <Button onClick={nextStep} size="lg">
          결과 확인 →
        </Button>
      </div>
    </div>
  );
}
