import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: string;
  prefix?: string;
}

export function Input({
  label,
  error,
  hint,
  suffix,
  prefix,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.replace(/\s/g, '-').toLowerCase();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full px-4 py-2.5 border rounded-lg text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-slate-100 disabled:text-slate-500
            ${error ? 'border-red-500' : 'border-slate-300'}
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-12' : ''}
            ${className}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && (
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface PriceInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  unit?: 'won' | 'man' | 'eok';
}

export function PriceInput({
  value,
  onChange,
  unit = 'won',
  ...props
}: PriceInputProps) {
  const multiplier = unit === 'eok' ? 100_000_000 : unit === 'man' ? 10_000 : 1;
  const displayValue = value / multiplier;
  const suffix = unit === 'eok' ? '억원' : unit === 'man' ? '만원' : '원';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const numValue = parseFloat(rawValue) || 0;
    onChange(numValue * multiplier);
  };

  return (
    <Input
      type="text"
      value={displayValue ? displayValue.toLocaleString() : ''}
      onChange={handleChange}
      suffix={suffix}
      {...props}
    />
  );
}
