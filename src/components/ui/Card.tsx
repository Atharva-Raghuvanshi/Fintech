import React from 'react';

export function Card({ children, className = '', elevated = false, noPadding = false }: { children: React.ReactNode, className?: string, elevated?: boolean, noPadding?: boolean }) {
  return (
    <div className={`bg-surface border border-white/5 rounded-2xl overflow-hidden relative group transition-colors duration-200 ${elevated ? 'bg-elevated shadow-inner shadow-white/5' : 'hover:bg-elevated/50'} ${noPadding ? '' : 'p-5'} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, action, subtitle }: { title: string, action?: React.ReactNode, subtitle?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
        {subtitle && <p className="text-[11px] text-text-tertiary mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function KpiCard({ title, value, trend, suffix = '' }: { title: string, value: string | number, trend?: { value: number, isPositive: boolean, label?: string }, suffix?: string }) {
  return (
    <Card className="flex flex-col justify-between min-h-[120px]">
      <h4 className="text-[13px] text-text-secondary font-medium">{title}</h4>
      <div className="mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-[32px] font-mono text-text-primary tabular-nums tracking-tight">{value}</span>
          {suffix && <span className="text-[13px] text-text-tertiary">{suffix}</span>}
        </div>
        {trend && (
          <div className="flex items-center gap-2 mt-1">
            <StatusPill 
              label={`${trend.isPositive ? '+' : ''}${trend.value}%`} 
              variant={trend.isPositive ? 'positive' : 'negative'} 
            />
            {trend.label && <span className="text-[11px] text-text-tertiary">{trend.label}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}

export function StatusPill({ label, variant = 'neutral' }: { label: string, variant?: 'positive' | 'negative' | 'warning' | 'neutral' | 'info' }) {
  const colors = {
    positive: 'bg-positive/10 text-positive border-positive/20',
    negative: 'bg-negative/10 text-negative border-negative/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-primary/10 text-primary border-primary/20',
    neutral: 'bg-white/5 text-text-secondary border-white/10',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${colors[variant]}`}>
      {label}
    </span>
  );
}

export function PeriodToggle({ options, active, onChange }: { options: string[], active: string, onChange: (opt: string) => void }) {
  return (
    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors ${active === opt ? 'bg-surface text-text-primary shadow-sm border border-white/5' : 'text-text-tertiary hover:text-text-secondary'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
