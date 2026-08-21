sed -i '209 a\
  app.post("/api/banking/rules", (req, res) => {\
    const newRule = { id: `rule_${Date.now()}`, keyword: req.body.keyword };\
    bankingData.rules.push(newRule);\
    res.json({ success: true, rules: bankingData.rules });\
  });\
  app.delete("/api/banking/rules/:id", (req, res) => {\
    bankingData.rules = bankingData.rules.filter(r => r.id !== req.params.id);\
    res.json({ success: true, rules: bankingData.rules });\
  });' server.ts
