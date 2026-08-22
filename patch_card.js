import fs from 'fs';

let content = fs.readFileSync('src/components/ui/Card.tsx', 'utf-8');

content = content.replace(
  'export function KpiCard({ title, value, trend, suffix = \'\' }: { title: string, value: string | number, trend?: { value: number, isPositive: boolean, label?: string }, suffix?: string }) {',
  'export function KpiCard({ title, value, trend, suffix = \'\', className = \'\' }: { title: string, value: string | number, trend?: { value: number, isPositive: boolean, label?: string }, suffix?: string, className?: string }) {'
);

content = content.replace(
  '<Card className="flex flex-col justify-between min-h-[120px]">',
  '<Card className={`flex flex-col justify-between min-h-[120px] ${className}`}>'
);

fs.writeFileSync('src/components/ui/Card.tsx', content);
