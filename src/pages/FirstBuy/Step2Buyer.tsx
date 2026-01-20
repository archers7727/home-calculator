import React from 'react';
import {
  Card,
  CardContent,
  Button,
  PriceInput,
  RadioGroup,
  Checkbox,
  Input,
} from '../../components/ui';
import { useCalculatorStore } from '../../store';
import { formatPriceWon } from '../../constants';

export function Step2Buyer() {
  const { buyer, updateBuyer, nextStep, prevStep } = useCalculatorStore();

  const houseCountOptions = [
    { value: 0, label: '무주택' },
    { value: 1, label: '1주택' },
    { value: 2, label: '2주택+' },
  ];

  const totalIncome = (buyer.income || 0) + (buyer.spouseIncome || 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">
            👤 구매자 정보
          </h3>

          {/* House Count */}
          <RadioGroup
            label="현재 주택 보유 수"
            options={houseCountOptions}
            value={buyer.houseCount ?? 0}
            onChange={(value) =>
              updateBuyer({ houseCount: value as 0 | 1 | 2 | 3 })
            }
          />

          {/* Special Conditions */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              ✨ 특별 조건 (해당 항목 체크)
            </label>

            <Checkbox
              label="생애최초 주택 구입"
              hint="본인/배우자 모두 주택 소유 이력 없음"
              checked={buyer.isFirstTime || false}
              onChange={(checked) => updateBuyer({ isFirstTime: checked })}
              disabled={buyer.houseCount !== 0}
            />

            <Checkbox
              label="신혼부부 (혼인 7년 이내)"
              checked={buyer.isNewlywed || false}
              onChange={(checked) => updateBuyer({ isNewlywed: checked })}
            />

            <div className="flex items-center gap-4">
              <Checkbox
                label="자녀 있음"
                checked={(buyer.childCount || 0) > 0}
                onChange={(checked) =>
                  updateBuyer({ childCount: checked ? 1 : 0 })
                }
              />
              {(buyer.childCount || 0) > 0 && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={buyer.childCount || 1}
                    onChange={(e) =>
                      updateBuyer({
                        childCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-slate-600">명</span>
                </div>
              )}
            </div>

            <Checkbox
              label="2년 내 출산 예정"
              checked={buyer.hasBabyPlan || false}
              onChange={(checked) => updateBuyer({ hasBabyPlan: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Income */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">💼 소득 정보</h3>

          <div className="grid grid-cols-2 gap-4">
            <PriceInput
              label="본인 연소득"
              value={buyer.income || 0}
              onChange={(value) => updateBuyer({ income: value })}
              unit="man"
            />
            <PriceInput
              label="배우자 연소득"
              value={buyer.spouseIncome || 0}
              onChange={(value) => updateBuyer({ spouseIncome: value })}
              unit="man"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">합산 연소득</span>
              <span className="font-bold text-blue-600">
                {formatPriceWon(totalIncome)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

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
