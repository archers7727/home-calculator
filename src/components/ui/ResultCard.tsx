import React from 'react';
import { formatPriceWon } from '../../constants';

interface ResultRowProps {
  label: string;
  value: number | string;
  isTotal?: boolean;
  isHighlight?: boolean;
  isSubtraction?: boolean;
  hint?: string;
}

export function ResultRow({
  label,
  value,
  isTotal = false,
  isHighlight = false,
  isSubtraction = false,
  hint,
}: ResultRowProps) {
  const formattedValue =
    typeof value === 'number' ? formatPriceWon(value) : value;

  return (
    <div
      className={`flex justify-between items-center py-2 ${
        isTotal ? 'border-t border-slate-200 pt-3 mt-1' : ''
      }`}
    >
      <div className="flex-1">
        <span
          className={`${
            isTotal ? 'font-bold text-slate-900' : 'text-slate-600'
          } ${isHighlight ? 'text-blue-600' : ''}`}
        >
          {label}
        </span>
        {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
      </div>
      <span
        className={`font-mono ${
          isTotal
            ? 'text-lg font-bold text-slate-900'
            : isHighlight
            ? 'font-bold text-blue-600'
            : isSubtraction
            ? 'text-emerald-600'
            : 'text-slate-700'
        }`}
      >
        {isSubtraction && typeof value === 'number' && value > 0 && '-'}
        {formattedValue}
      </span>
    </div>
  );
}

interface ResultSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ResultSection({
  title,
  children,
  className = '',
}: ResultSectionProps) {
  return (
    <div className={`bg-slate-50 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-200">
        {title}
      </h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

interface TotalResultCardProps {
  title: string;
  amount: number;
  description?: string;
  variant?: 'primary' | 'success' | 'warning';
}

export function TotalResultCard({
  title,
  amount,
  description,
  variant = 'primary',
}: TotalResultCardProps) {
  const variantStyles = {
    primary: 'bg-blue-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
  };

  return (
    <div
      className={`${variantStyles[variant]} text-white rounded-xl p-6 text-center`}
    >
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold mb-1">{formatPriceWon(amount)}</p>
      {description && <p className="text-sm opacity-80">{description}</p>}
    </div>
  );
}

interface ConditionCheckProps {
  label: string;
  met: boolean;
  detail?: string;
}

export function ConditionCheck({ label, met, detail }: ConditionCheckProps) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className={`text-lg ${met ? 'text-emerald-500' : 'text-red-500'}`}>
        {met ? '✓' : '✗'}
      </span>
      <div>
        <span className="text-sm text-slate-700">{label}</span>
        {detail && <p className="text-xs text-slate-500">{detail}</p>}
      </div>
    </div>
  );
}
