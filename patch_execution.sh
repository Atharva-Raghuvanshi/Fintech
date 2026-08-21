awk '
/import type { Portfolio, AuditLogEntry } from '"'"'\.\.\/types'"'"';/ {
  print $0
  print "import { doc, runTransaction, collection } from \"firebase/firestore\";"
  print "import { db } from \"../lib/firebase\";"
  print "import { useAuth } from \"../contexts/AuthContext\";"
  next
}
/export function ExecutionLayer\(\) {/ {
  print $0
  print "  const { user } = useAuth();"
  next
}
/const handleExecute = async \(e: React\.FormEvent\) => {/ {
  print "  const handleExecute = async (e: React.FormEvent) => {"
  print "    e.preventDefault();"
  print "    if (!portfolio || !user) return;"
  print "    setStatus({ type: \"loading\", msg: \"Executing ACID Transaction...\" });"
  print "    "
  print "    const totalAmount = Number(quantity) * (orderType === \"Market\" ? currentPrice : Number(price));"
  print "    try {"
  print "      await runTransaction(db, async (transaction) => {"
  print "        const portfolioRef = doc(db, \"users\", user.uid, \"portfolio\", \"main\");"
  print "        const portfolioDoc = await transaction.get(portfolioRef);"
  print "        "
  print "        let currentCash = portfolio.cash;"
  print "        if (portfolioDoc.exists()) {"
  print "          currentCash = portfolioDoc.data().cash;"
  print "        }"
  print "        "
  print "        if (action === \"BUY\" && currentCash < totalAmount) {"
  print "          throw new Error(\"Insufficient margin for this transaction.\");"
  print "        }"
  print "        "
  print "        const newCash = action === \"BUY\" ? currentCash - totalAmount : currentCash + totalAmount;"
  print "        const assetKey = activeAssetClass === \"Crypto\" ? \"crypto\" : activeAssetClass === \"Gold\" ? \"gold\" : activeAssetClass === \"Silver\" ? \"silver\" : activeAssetClass === \"Mutual Funds\" ? \"mutualFunds\" : activeAssetClass === \"Bonds\" ? \"bonds\" : \"equity\";"
  print "        "
  print "        let currentAssetVal = portfolioDoc.exists() ? (portfolioDoc.data()[assetKey] || 0) : portfolio[assetKey] || 0;"
  print "        const newAssetVal = action === \"BUY\" ? currentAssetVal + totalAmount : Math.max(0, currentAssetVal - totalAmount);"
  print "        "
  print "        const newPortfolioData = {"
  print "          userId: user.uid,"
  print "          cash: newCash,"
  print "          equity: assetKey === \"equity\" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().equity : portfolio.equity),"
  print "          mutualFunds: assetKey === \"mutualFunds\" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().mutualFunds : portfolio.mutualFunds),"
  print "          gold: assetKey === \"gold\" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().gold : portfolio.gold),"
  print "          crypto: assetKey === \"crypto\" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().crypto : 0),"
  print "          silver: assetKey === \"silver\" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().silver : 0),"
  print "          bonds: assetKey === \"bonds\" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().bonds : 0),"
  print "        };"
  print "        "
  print "        transaction.set(portfolioRef, newPortfolioData, { merge: true });"
  print "        "
  print "        const tradeRef = doc(collection(db, \"users\", user.uid, \"trades\"));"
  print "        transaction.set(tradeRef, {"
  print "          userId: user.uid,"
  print "          asset: activeAsset,"
  print "          action,"
  print "          amount: totalAmount,"
  print "          price: orderType === \"Market\" ? currentPrice : Number(price),"
  print "          quantity: Number(quantity),"
  print "          orderType,"
  print "          timestamp: Date.now(),"
  print "          consentId: `cons_${orderType.toLowerCase()}_${Date.now()}`"
  print "        });"
  print "      });"
  print "      setStatus({ type: \"success\", msg: `${orderType} ${action} order placed successfully with ACID guarantees.` });"
  print "      // Note: Component state updates will occur via the onSnapshot listener if added, "
  print "      // but for immediate feedback we rely on local state updates if needed, though here we just rely on standard fetching for now."
  print "    } catch (err: any) {"
  print "      setStatus({ type: \"error\", msg: err.message || \"Execution failed.\" });"
  print "    } finally {"
  print "      setTimeout(() => setStatus(null), 4000);"
  print "    }"
  print "  };"
  skip = 1
  next
}
skip {
  if (/^  };/) {
    skip = 0
  }
  next
}
{ print }
' src/components/ExecutionLayer.tsx > src/components/ExecutionLayer_new.tsx
mv src/components/ExecutionLayer_new.tsx src/components/ExecutionLayer.tsx
