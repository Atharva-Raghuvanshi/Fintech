awk '
/app.post\("\/api\/virtual-ca\/insights"/ {
  print "  app.get(\"/api/ai-summary\", async (req, res) => {"
  print "    try {"
  print "      const prompt = `You are a top-tier financial advisor AI. Analyze the following complete financial state of the user:\\nPortfolio: ${JSON.stringify(portfolio)}\\nFamily Data: ${JSON.stringify(familyData)}\\nBank Accounts: ${JSON.stringify(bankingData.linkedBanks)}\\nTransactions (last 20): ${JSON.stringify(bankingData.transactions.slice(0, 20))}\\nGoals: ${JSON.stringify(goals)}\\n\\nProvide a concise, holistic summary of their financial health, and 3 actionable quick tips based on this exact data.`;"
  print "      const response = await ai.models.generateContent({"
  print "        model: \"gemini-3.5-flash\","
  print "        contents: prompt,"
  print "        config: {"
  print "          responseMimeType: \"application/json\","
  print "          responseSchema: {"
  print "            type: Type.OBJECT,"
  print "            properties: {"
  print "              summary: { type: Type.STRING },"
  print "              tips: { type: Type.ARRAY, items: { type: Type.STRING } }"
  print "            },"
  print "            required: [\"summary\", \"tips\"]"
  print "          }"
  print "        }"
  print "      });"
  print "      res.json(JSON.parse(response.text?.trim() || `{\"summary\": \"Data unavailable\", \"tips\": []}`));"
  print "    } catch (e: any) {"
  print "      console.error(\"AI Summary error:\", e);"
  print "      res.status(500).json({ error: \"Failed to generate AI summary.\" });"
  print "    }"
  print "  });"
  print ""
}
{ print }
' server.ts > server_new.ts
mv server_new.ts server.ts
