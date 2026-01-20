import React from 'react';

interface RadioOption {
  value: string | number;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  direction?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  direction = 'horizontal',
}: RadioGroupProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div
        className={`flex ${
          direction === 'vertical' ? 'flex-col gap-2' : 'flex-wrap gap-3'
        }`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
              value === option.value
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
            }`}
          >
            <input
              type="radio"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                value === option.value
                  ? 'border-blue-600'
                  : 'border-slate-400'
              }`}
            >
              {value === option.value && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </span>
            <span className="text-sm font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
