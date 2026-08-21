const fs = require('fs');
const content = fs.readFileSync('src/components/GoogleSheetsSync.tsx', 'utf-8');

const importReplacement = `import { FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Clock, RefreshCw } from 'lucide-react';`;
let newContent = content.replace(/import \{ FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 \} from 'lucide-react';/, importReplacement);

const stateReplacement = `  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportUrl, setExportUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(false);`;
newContent = newContent.replace(/  const \[isExporting, setIsExporting\] = useState\(false\);\n  const \[exportSuccess, setExportSuccess\] = useState\(false\);\n  const \[exportUrl, setExportUrl\] = useState\(''\);\n  const \[error, setError\] = useState<string \| null>\(null\);/, stateReplacement);

const uiReplacement = `        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Auto-Push Sync</h4>
                <p className="text-xs text-slate-500">Automatically sync transactions in the background</p>
              </div>
            </div>
            
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                autoSync ? "bg-emerald-500" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  autoSync ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
          
          {autoSync && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-800">Sync Schedule Active</p>
                <p className="text-xs text-slate-600 mt-1">Background worker is monitoring for new transactions. Changes will be pushed to your active spreadsheet every hour.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;
newContent = newContent.replace(/        \)}\n      <\/div>\n    <\/div>\n  \);\n}/, uiReplacement);

fs.writeFileSync('src/components/GoogleSheetsSync.tsx', newContent);
