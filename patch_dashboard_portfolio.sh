awk '
/useEffect\(\(\) => {/ {
  print "  useEffect(() => {"
  print "    const { doc, onSnapshot } = require(\"firebase/firestore\");"
  print "    const { db, auth } = require(\"../lib/firebase\");"
  print "    if (auth.currentUser) {"
  print "      const unsub = onSnapshot(doc(db, \"users\", auth.currentUser.uid, \"portfolio\", \"main\"), (snap) => {"
  print "        if (snap.exists()) setPortfolio(snap.data());"
  print "        else fetch(\"/api/portfolio\").then(res => res.json()).then(data => setPortfolio(data));"
  print "      });"
  print "      fetch(\"/api/alerts\").then(res => res.json()).then(data => setAlerts(data));"
  print "      return () => unsub();"
  print "    } else {"
  print "      fetch(\"/api/portfolio\").then(res => res.json()).then(data => setPortfolio(data));"
  print "      fetch(\"/api/alerts\").then(res => res.json()).then(data => setAlerts(data));"
  print "    }"
  skip = 1
  next
}
skip {
  if (/^  }, \[\]\);/) {
    print "  }, []);"
    skip = 0
  }
  next
}
{ print }
' src/components/Dashboard.tsx > src/components/Dashboard_new.tsx
mv src/components/Dashboard_new.tsx src/components/Dashboard.tsx
