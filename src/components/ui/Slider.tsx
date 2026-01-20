import React from 'react';
import { formatPrice } from '../../constants';

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: 'won' | 'man' | 'eok';
  showValue?: boolean;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = 'won',
  showValue = true,
}: SliderProps) {
  const multiplier = unit === 'eok' ? 100_000_000 : unit === 'man' ? 10_000 : 1;
  const displayMin = min / multiplier;
  const displayMax = max / multiplier;
  const displayValue = value / multiplier;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) * multiplier;
    onChange(newValue);
  };

  const percentage = ((displayValue - displayMin) / (displayMax - displayMin)) * 100;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className="text-sm font-medium text-slate-700">{label}</label>
          )}
          {showValue && (
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(value)}원
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={displayMin}
          max={displayMax}
          step={step / multiplier}
          value={displayValue}
          onChange={handleChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-blue-600
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110"
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-500">
          {displayMin}
          {unit === 'eok' ? '억' : unit === 'man' ? '만' : ''}
        </span>
        <span className="text-xs text-slate-500">
          {displayMax}
          {unit === 'eok' ? '억' : unit === 'man' ? '만' : ''}
        </span>
      </div>
    </div>
  );
}
