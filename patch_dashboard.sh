awk '
/const \[tradeStatus/ {
  print $0
  print "  const [aiInsight, setAiInsight] = useState<{summary: string, tips: string[]} | null>(null);"
  print "  const [isLoadingAi, setIsLoadingAi] = useState(false);"
  print "  const fetchAiInsight = async () => {"
  print "    setIsLoadingAi(true);"
  print "    try {"
  print "      const res = await fetch(\"/api/ai-summary\");"
  print "      const data = await res.json();"
  print "      if (res.ok) {"
  print "        setAiInsight(data);"
  print "      }"
  print "    } catch (e) {"
  print "      console.error(e);"
  print "    } finally {"
  print "      setIsLoadingAi(false);"
  print "    }"
  print "  };"
  next
}
/<p className=\"text-slate-500 mt-1\">Your real-time wealth intelligence overview\.<\/p>/ {
  print $0
  print "      </motion.div>"
  print "      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>"
  print "        {!aiInsight ? ("
  print "          <button onClick={fetchAiInsight} disabled={isLoadingAi} className=\"flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50\">"
  print "            <Lightbulb className=\"w-4 h-4\" />"
  print "            {isLoadingAi ? \"Analyzing Database...\" : \"Generate AI Dashboard Summary\"}"
  print "          </button>"
  print "        ) : ("
  print "          <div className=\"mt-6 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden\">"
  print "            <div className=\"absolute top-0 right-0 p-4 opacity-10\">"
  print "              <Zap className=\"w-32 h-32\" />"
  print "            </div>"
  print "            <div className=\"relative z-10\">"
  print "              <div className=\"flex items-center gap-2 mb-3\">"
  print "                <div className=\"p-1.5 bg-indigo-500/30 rounded-md\"><Lightbulb className=\"w-4 h-4 text-indigo-300\" /></div>"
  print "                <h2 className=\"text-sm font-bold tracking-wider text-indigo-200 uppercase\">AI Holistic Summary</h2>"
  print "              </div>"
  print "              <p className=\"text-slate-200 leading-relaxed text-sm max-w-4xl\">{aiInsight.summary}</p>"
  print "              <div className=\"mt-5 grid grid-cols-1 md:grid-cols-3 gap-4\">"
  print "                {aiInsight.tips.map((tip, i) => ("
  print "                  <div key={i} className=\"bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex items-start gap-3\">"
  print "                    <CheckCircle2 className=\"w-4 h-4 text-emerald-400 shrink-0 mt-0.5\" />"
  print "                    <p className=\"text-xs text-slate-100 leading-tight\">{tip}</p>"
  print "                  </div>"
  print "                ))}"
  print "              </div>"
  print "            </div>"
  print "          </div>"
  print "        )}"
  next
}
/<\/motion.div>/ {
  # Skip the motion.div closing tag that we just replaced above, but only the specific one immediately after the title
  if (skip_next_motion_div) {
    skip_next_motion_div = 0
    next
  }
}
{
  if ($0 == "      </motion.div>" && prev_line == "        <p className=\"text-slate-500 mt-1\">Your real-time wealth intelligence overview.</p>") {
    prev_line = $0
    next
  }
  prev_line = $0
  print
}
' src/components/Dashboard.tsx > src/components/Dashboard_new.tsx
mv src/components/Dashboard_new.tsx src/components/Dashboard.tsx
