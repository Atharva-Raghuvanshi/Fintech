export interface Portfolio {
  cash: number;
  equity: number;
  mutualFunds: number;
  gold: number;
  crypto?: number;
  silver?: number;
  bonds?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'BUY' | 'SELL';
  asset: string;
  amount: number;
  status: string;
  consentId: string;
}

export interface TaxResult {
  oldRegime: { taxable: number; tax: number };
  newRegime: { taxable: number; tax: number };
  recommendation: 'OLD_REGIME' | 'NEW_REGIME';
}

export interface Alert { id: number; type: string; title: string; message: string; action: string; }
export interface FamilyMember { id: string; name: string; role: string; ownership: number; totalValue: number; }
export interface JointAsset { id: string; name: string; members: string[]; split: string; value: number; }
export interface Goal { id: string; name: string; target: number; current: number; monthlySip: number; year: number; probability: number; status: string; }
export interface Bank { id: string; name: string; status: string; balance: number; }
export interface Transaction { id: string; date: string; desc: string; amount: number; cat: string; account: string; }
export interface Emi { id: string; name: string; bank: string; emi: number; remaining: number; nextDate: string; rate: string; }
export interface Recommendation { id: string; title: string; desc: string; type: string; action: string; }
export interface TaxEstimate { annualIncome: number; current80C: number; utilized80C: number; remaining80C: number; taxBracket: number; potentialSavings: number; }
export interface RecurringRule { id: string; keyword: string; }
