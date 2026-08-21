import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import { mockDB } from "./mockDatabase.js";

dotenv.config();

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

// --- MOCK DATABASE ---
let portfolio = mockDB.portfolio;
const auditLog = mockDB.trades;

let alerts = [
  { id: 1, type: 'warning', title: 'Action Required: Missed SIP', message: '₹10,000 SIP for Parag Parikh Flexi Cap failed on Oct 24 due to insufficient funds.', action: 'Pay Now' },
  { id: 2, type: 'info', title: 'Market Movement', message: 'Your Tech portfolio surged by 4.2% today.', action: 'View Details' }
];

let familyData = mockDB.familyData;

let goals = [
  { id: '1', name: 'Retirement Corpus', target: 50000000, current: 8500000, monthlySip: 45000, year: 2045, probability: 88, status: 'On Track' },
  { id: '2', name: 'Child Education', target: 10000000, current: 1200000, monthlySip: 15000, year: 2035, probability: 92, status: 'On Track' },
  { id: '3', name: 'Downpayment', target: 5000000, current: 1500000, monthlySip: 25000, year: 2028, probability: 45, status: 'At Risk' },
];

let bankingData = {
  linkedBanks: mockDB.bankAccounts,
  transactions: mockDB.transactions,
  rules: [{ id: 'rule_1', keyword: 'Netflix' }, { id: 'rule_2', keyword: 'Spotify' }],
  emis: [
    { id: 'l1', name: 'Home Loan', bank: 'SBI', emi: 45000, remaining: 4500000, nextDate: 'Nov 5, 2023', rate: '8.5%' },
    { id: 'l2', name: 'Car Loan', bank: 'HDFC', emi: 12500, remaining: 450000, nextDate: 'Nov 10, 2023', rate: '9.2%' }
  ]
};

let recommendations = [
  { id: 'r1', title: 'Tax-Loss Harvesting Opportunity', desc: 'You have unrealized short-term losses of ₹45,000 in your Tech portfolio...', type: 'Tax', action: 'Review Holdings' },
  { id: 'r2', title: 'SIP Top-Up Recommendation', desc: 'Your income increased by 15% this year, but your SIPs remained flat...', type: 'Growth', action: 'Adjust SIPs' }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API LAYER ---

  app.get("/api/portfolio", (req, res) => {
    res.json(portfolio);
  });

  app.post("/api/execute", (req, res) => {
    const { action, asset, amount, consentProof } = req.body;

    if (!consentProof) {
      return res.status(400).json({ error: "Explicit user consent proof required for execution." });
    }

    if (action === "BUY" && portfolio.cash < amount) {
      return res.status(400).json({ error: "Insufficient cash balance." });
    }

    if (action === "BUY") {
      portfolio.cash -= amount;
      if (asset.includes("MF") || asset.includes("Fund")) {
        portfolio.mutualFunds += amount;
      } else if (asset.includes("Gold")) {
        portfolio.gold += amount;
      } else {
        portfolio.equity += amount;
      }
    } else if (action === "SELL") {
      portfolio.cash += amount;
      if (asset.includes("MF") || asset.includes("Fund") || asset.includes("PARAGPARIKH")) {
        portfolio.mutualFunds = Math.max(0, portfolio.mutualFunds - amount);
      } else if (asset.includes("Gold") || asset.includes("SGB")) {
        portfolio.gold = Math.max(0, portfolio.gold - amount);
      } else {
        portfolio.equity = Math.max(0, portfolio.equity - amount);
      }
    }

    const tx = {
      id: `tx_${Math.floor(Math.random() * 100000)}`,
      timestamp: new Date().toISOString(),
      action,
      asset,
      amount,
      status: "EXECUTED",
      consentId: consentProof,
    };
    auditLog.unshift(tx);

    res.json({ success: true, transaction: tx, newPortfolio: portfolio });
  });

  app.get("/api/audit-log", (req, res) => {
    res.json(auditLog);
  });

  app.post("/api/tax/compute", (req, res) => {
    const { income, deductions80C, healthInsurance, homeLoanInterest } = req.body;

    const oldRegimeDeductions = Math.min(deductions80C, 150000) + Math.min(healthInsurance, 25000) + Math.min(homeLoanInterest, 200000) + 50000;
    const oldRegimeTaxable = Math.max(0, income - oldRegimeDeductions);
    
    let oldTax = 0;
    if (oldRegimeTaxable > 1000000) oldTax = 112500 + (oldRegimeTaxable - 1000000) * 0.3;
    else if (oldRegimeTaxable > 500000) oldTax = 12500 + (oldRegimeTaxable - 500000) * 0.2;
    else if (oldRegimeTaxable > 250000) oldTax = (oldRegimeTaxable - 250000) * 0.05;

    const newRegimeTaxable = Math.max(0, income - 50000);
    
    let newTax = 0;
    if (newRegimeTaxable > 1500000) newTax = 150000 + (newRegimeTaxable - 1500000) * 0.3;
    else if (newRegimeTaxable > 1200000) newTax = 90000 + (newRegimeTaxable - 1200000) * 0.2;
    else if (newRegimeTaxable > 900000) newTax = 45000 + (newRegimeTaxable - 900000) * 0.15;
    else if (newRegimeTaxable > 600000) newTax = 15000 + (newRegimeTaxable - 600000) * 0.1;
    else if (newRegimeTaxable > 300000) newTax = (newRegimeTaxable - 300000) * 0.05;

    if (oldRegimeTaxable <= 500000) oldTax = 0;
    if (newRegimeTaxable <= 700000) newTax = 0;

    res.json({
      oldRegime: { taxable: oldRegimeTaxable, tax: oldTax + (oldTax * 0.04) },
      newRegime: { taxable: newRegimeTaxable, tax: newTax + (newTax * 0.04) },
      recommendation: oldTax < newTax ? "OLD_REGIME" : "NEW_REGIME"
    });
  });

  app.get("/api/tax/estimate", (req, res) => {
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).getTime();
    
    // Extrapolate or calculate income from transactions
    const incomeTxs = bankingData.transactions.filter(t => t.cat === 'Income' && new Date(t.date).getTime() > oneYearAgo);
    const annualIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);

    // Sum investments for 80C
    const investTxs = bankingData.transactions.filter(t => t.cat === 'Investment' && new Date(t.date).getTime() > oneYearAgo);
    const current80C = Math.abs(investTxs.reduce((sum, t) => sum + t.amount, 0));
    
    const max80C = 150000;
    const utilized80C = Math.min(current80C, max80C);
    const remaining80C = max80C - utilized80C;

    // Simple flat tax bracket estimation
    const taxBracket = annualIncome > 1000000 ? 0.3 : (annualIncome > 500000 ? 0.2 : 0.05);
    const potentialSavings = remaining80C * taxBracket;

    res.json({
      annualIncome,
      current80C,
      utilized80C,
      remaining80C,
      taxBracket: taxBracket * 100,
      potentialSavings
    });
  });

  // --- NEW ENDPOINTS ---
  
  app.get("/api/alerts", (req, res) => res.json(alerts));
  
  app.delete("/api/alerts/:id", (req, res) => {
    alerts = alerts.filter(a => a.id !== parseInt(req.params.id));
    res.json({ success: true, alerts });
  });

  app.post("/api/alerts/:id/resolve", (req, res) => {
    alerts = alerts.filter(a => a.id !== parseInt(req.params.id));
    res.json({ success: true, alerts });
  });

  app.get("/api/family", (req, res) => res.json(familyData));
  
  app.post("/api/family/fix-nominee", (req, res) => {
    familyData.nomineeHealth.missing = 0;
    familyData.nomineeHealth.registered = familyData.nomineeHealth.accounts;
    res.json({ success: true, familyData });
  });

  app.get("/api/goals", (req, res) => res.json(goals));
  
  app.post("/api/goals", (req, res) => {
    const newGoal = {
      id: `g_${Date.now()}`,
      name: req.body.name || 'New Investment Goal',
      target: req.body.target || 1000000,
      current: 0,
      monthlySip: req.body.monthlySip || 5000,
      year: req.body.year || 2030,
      probability: 90,
      status: 'On Track'
    };
    goals.push(newGoal);
    res.json({ success: true, goals });
  });

  app.get("/api/banking", (req, res) => res.json(bankingData));
  app.post("/api/banking/rules", (req, res) => {
    const newRule = { id: `rule_${Date.now()}`, keyword: req.body.keyword };
    bankingData.rules.push(newRule);
    res.json({ success: true, rules: bankingData.rules });
  });
  app.delete("/api/banking/rules/:id", (req, res) => {
    bankingData.rules = bankingData.rules.filter(r => r.id !== req.params.id);
    res.json({ success: true, rules: bankingData.rules });
  });
  
  app.post("/api/banking/link", (req, res) => {
    const { name } = req.body;
    bankingData.linkedBanks.push({ 
      id: `b_${Date.now()}`, 
      name, 
      status: 'Just synced', 
      balance: Math.floor(Math.random() * 500000) 
    });
    res.json({ success: true, bankingData });
  });

  app.get("/api/recommendations", (req, res) => res.json(recommendations));
  
  app.post("/api/recommendations/:id/action", (req, res) => {
    recommendations = recommendations.filter(r => r.id !== req.params.id);
    res.json({ success: true, recommendations });
  });

  app.post("/api/action/pdf", (req, res) => {
    res.json({ success: true, message: 'CA Packet PDF successfully generated and sent to email.' });
  });

  app.get("/api/ai-summary", async (req, res) => {
    try {
      const prompt = `You are a top-tier financial advisor AI. Analyze the following complete financial state of the user:\nPortfolio: ${JSON.stringify(portfolio)}\nFamily Data: ${JSON.stringify(familyData)}\nBank Accounts: ${JSON.stringify(bankingData.linkedBanks)}\nTransactions (last 20): ${JSON.stringify(bankingData.transactions.slice(0, 20))}\nGoals: ${JSON.stringify(goals)}\n\nProvide a concise, holistic summary of their financial health, and 3 actionable quick tips based on this exact data.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "tips"]
          }
        }
      });
      res.json(JSON.parse(response.text?.trim() || `{"summary": "Data unavailable", "tips": []}`));
    } catch (e: any) {
      console.error("AI Summary error:", e);
      res.status(500).json({ error: "Failed to generate AI summary." });
    }
  });

  app.post("/api/virtual-ca/insights", async (req, res) => {
    try {
      const { query, mode } = req.body;
      
      const prompt = `You are a virtual Chartered Accountant for a high net worth family.
You have access to their entire financial database including 150 transactions, 120 trades, bank info, and family asset splits.
Here is a summary of the data:
Portfolio: ${JSON.stringify(portfolio)}
Family Data: ${JSON.stringify(familyData)}
Bank Accounts: ${JSON.stringify(bankingData.linkedBanks)}
Recent Transactions: ${JSON.stringify(bankingData.transactions.slice(0, 20))}
Recent Trades: ${JSON.stringify(auditLog.slice(0, 20))}

The user asks: "${query}"
Provide a professional, helpful response analyzing this data. Return the response as JSON with two fields: 'message' (the CA's reply string) and 'type' (either 'insight', 'alert', or 'success').`;

      let model = "gemini-3.5-flash";
      let config: any = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            type: { type: Type.STRING }
          },
          required: ["message", "type"]
        }
      };

      if (mode === "fast") {
        model = "gemini-3.1-flash-lite";
      } else if (mode === "deep") {
        model = "gemini-3.1-pro-preview";
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else if (mode === "search") {
        model = "gemini-3.5-flash";
        config.tools = [{ googleSearch: {} }];
        // Note: Grounding with JSON schema might be tricky in some older versions, 
        // but it should work. If it fails, we can fall back to standard text parsing.
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config
      });
      
      let result;
      try {
        result = JSON.parse(response.text?.trim() || "{}");
      } catch(e) {
        // Fallback if model fails to return strict JSON when using tools
        result = { message: response.text, type: "insight" };
      }
      
      res.json(result);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "Failed to get insights from Virtual CA.", details: e.message });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
