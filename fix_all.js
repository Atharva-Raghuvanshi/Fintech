import fs from 'fs';

// Fix ExecutionLayer.tsx
let execContent = fs.readFileSync('src/components/ExecutionLayer.tsx', 'utf-8');

const insertBlock = `    try {
      await insertAppData({
        user_id: user.uid,
        action: action,
        asset: activeAsset,
        amount: totalAmount,
        order_type: orderType,
        quantity: Number(quantity),
        price: orderType === "Market" ? currentPrice : Number(price)
      });
    } catch (e) {
      console.error("Supabase insert failed", e);
    }`;

// Replace the misordered block
execContent = execContent.replace(insertBlock, "");
execContent = execContent.replace(
  `const totalAmount = Number(quantity) * (orderType === "Market" ? currentPrice : Number(price));`,
  `const totalAmount = Number(quantity) * (orderType === "Market" ? currentPrice : Number(price));\n${insertBlock}`
);

fs.writeFileSync('src/components/ExecutionLayer.tsx', execContent);


// Fix supabase.ts
let sbContent = fs.readFileSync('src/lib/supabase.ts', 'utf-8');
sbContent = `/// <reference types="vite/client" />\n` + sbContent;
fs.writeFileSync('src/lib/supabase.ts', sbContent);

