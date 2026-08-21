awk '
/useEffect\(\(\) => {/ {
  print "  useEffect(() => {"
  print "    if (!user) return;"
  print "    const { onSnapshot } = require(\"firebase/firestore\");"
  print "    const portfolioRef = doc(db, \"users\", user.uid, \"portfolio\", \"main\");"
  print "    const unsub = onSnapshot(portfolioRef, (snap) => {"
  print "      if (snap.exists()) setPortfolio(snap.data() as Portfolio);"
  print "      else {"
  print "        // Initialize from mock if not exists"
  print "        fetch(\"/api/portfolio\").then(r => r.json()).then(data => setPortfolio(data));"
  print "      }"
  print "    });"
  print "    fetch(\"/api/audit-log\").then(res => res.json()).then(data => setAuditLog(data));"
  print "    return () => unsub();"
  skip = 1
  next
}
skip {
  if (/^  }, \[\]\);/) {
    print "  }, [user]);"
    skip = 0
  }
  next
}
{ print }
' src/components/ExecutionLayer.tsx > src/components/ExecutionLayer_new.tsx
mv src/components/ExecutionLayer_new.tsx src/components/ExecutionLayer.tsx
