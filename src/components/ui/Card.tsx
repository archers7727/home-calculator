import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  selected?: boolean;
}

export function Card({
  children,
  className = '',
  onClick,
  hover = false,
  selected = false,
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl border shadow-sm';
  const hoverStyles = hover
    ? 'cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200'
    : '';
  const selectedStyles = selected
    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
    : 'border-slate-200';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

interface ScenarioCardProps {
  icon: string;
  title: string;
  description: string;
  subtext: string;
  onClick: () => void;
  selected?: boolean;
}

export function ScenarioCard({
  icon,
  title,
  description,
  subtext,
  onClick,
  selected = false,
}: ScenarioCardProps) {
  return (
    <Card
      hover
      selected={selected}
      onClick={onClick}
      className="p-6 text-center"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 mb-2">{description}</p>
      <p className="text-xs text-blue-600 font-medium">"{subtext}"</p>
    </Card>
  );
}
