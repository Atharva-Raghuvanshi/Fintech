import fs from 'fs';

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Fix PeriodToggle
content = content.replace(
  /<PeriodToggle options=\{\['1W', '1M', '3M', '1Y', 'ALL'\]\} active="1M" onChange=\{\(\) => \{\}\} \/>/,
  `<PeriodToggle options={['1W', '1M', '3M', '1Y', 'ALL']} active={heroPeriod} onChange={setHeroPeriod} />`
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
