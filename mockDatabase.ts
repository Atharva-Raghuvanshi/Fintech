export const generateMockDatabase = () => {
  const transactions = [];
  const trades = [];
  const bankAccounts = [
    { id: 'b1', name: 'HDFC Bank', status: 'Synced 10 mins ago', balance: 1450000 },
    { id: 'b2', name: 'Axis Bank', status: 'Synced 2 hours ago', balance: 320000 },
    { id: 'b3', name: 'ICICI Bank', status: 'Synced 1 day ago', balance: 75000 },
  ];

  const categories = ['Shopping', 'Food', 'Investment', 'Income', 'Utilities', 'Travel'];
  const merchants = ['Amazon Pay India', 'Starbucks', 'Zerodha Broking Ltd', 'Salary TechCorp Inc', 'Uber', 'MakeMyTrip', 'Swiggy', 'Zomato', 'Reliance Fresh'];
  
  const assets = ['NIFTYBEES', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'SBIN', 'BHARTIARTL'];

  // Generate 200 transactions
  for (let i = 0; i < 200; i++) {
    const isIncome = Math.random() > 0.85;
    const cat = isIncome ? 'Income' : categories[Math.floor(Math.random() * (categories.length - 1))];
    const merchant = isIncome ? 'Salary TechCorp Inc' : merchants[Math.floor(Math.random() * merchants.length)];
    const amount = isIncome ? Math.floor(Math.random() * 50000) + 50000 : -(Math.floor(Math.random() * 10000) + 100);
    const account = bankAccounts[Math.floor(Math.random() * bankAccounts.length)].name;
    const date = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
    
    transactions.push({
      id: `t_${i}`,
      date: date.toISOString(),
      desc: merchant,
      amount,
      cat,
      account,
    });
  }

  // Generate 200 trades
  for (let i = 0; i < 200; i++) {
    const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const amount = Math.floor(Math.random() * 50000) + 5000;
    const date = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
    
    trades.push({
      id: `tr_${i}`,
      timestamp: date.toISOString(),
      action,
      asset,
      amount,
      status: 'COMPLETED',
      consentId: `cons_${Math.floor(Math.random() * 100000)}`,
    });
  }

  const familyData = {
    members: [
      { id: '1', name: 'Primary User', role: 'Self', ownership: 55, totalValue: 8500000 },
      { id: '2', name: 'Sarah Jenkins', role: 'Spouse', ownership: 30, totalValue: 4600000 },
      { id: '3', name: 'Aarav Jenkins', role: 'Child (Minor)', ownership: 15, totalValue: 2300000 }
    ],
    jointAssets: [
      { id: 'a1', name: 'Primary Residence', members: ['Primary User', 'Sarah Jenkins'], split: '50/50', value: 15000000 },
      { id: 'a2', name: 'Joint Brokerage', members: ['Primary User', 'Sarah Jenkins'], split: '70/30', value: 4500000 },
      { id: 'a3', name: 'Vacation Home', members: ['Primary User', 'Sarah Jenkins', 'Aarav Jenkins'], split: '40/40/20', value: 7000000 }
    ],
    nomineeHealth: { accounts: 12, registered: 9, missing: 3 }
  };

  const portfolio = {
    cash: bankAccounts.reduce((acc, curr) => acc + curr.balance, 0),
    equity: 4500000,
    mutualFunds: 2800000,
    gold: 850000,
  };

  return {
    transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    trades: trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    bankAccounts,
    familyData,
    portfolio,
  };
};

export const mockDB = generateMockDatabase();
