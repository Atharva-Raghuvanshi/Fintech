import fs from 'fs';

let content = fs.readFileSync('src/components/ExecutionLayer.tsx', 'utf-8');

// Add import
const importToAdd = `import { insertAppData } from '../lib/supabaseActions';\n`;
content = content.replace("import { useAuth } from \"../contexts/AuthContext\";", "import { useAuth } from \"../contexts/AuthContext\";\n" + importToAdd);

// In handleExecute, after setting status to loading:
const insertSupabase = `
    try {
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
    }
`;

content = content.replace(
  `setStatus({ type: "loading", msg: "Executing ACID Transaction..." });`,
  `setStatus({ type: "loading", msg: "Executing ACID Transaction..." });\n` + insertSupabase
);

fs.writeFileSync('src/components/ExecutionLayer.tsx', content);
