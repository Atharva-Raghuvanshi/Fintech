import fs from 'fs';

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Replace xl:col-span-8 with xl:col-span-9
content = content.replace(
  '<div className="xl:col-span-8 h-full">',
  '<div className="xl:col-span-9 h-full">'
);

// Replace the calendar/kpi section with just the KpiCard
const calendarRegex = /<div className="xl:col-span-4 h-full flex gap-4">[\s\S]*?<Card className="flex-1 flex flex-col justify-center items-center p-3">[\s\S]*?<\/Card>[\s\S]*?<div className="flex-1">[\s\S]*?<KpiCard \s*title="Monthly Contrib" \s*value="1\.25L"\s*trend=\{\{ value: 4\.2, isPositive: true, label: 'vs last mo' \}\}\s*\/>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

content = content.replace(calendarRegex, 
`<div className="xl:col-span-3 h-full">
          <KpiCard 
            title="Monthly Contrib" 
            value="1.25L"
            trend={{ value: 4.2, isPositive: true, label: 'vs last mo' }}
            className="h-full"
          />
        </div>`
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
