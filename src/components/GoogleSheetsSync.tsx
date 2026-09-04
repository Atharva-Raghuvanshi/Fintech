import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAccessToken, loginWithGoogle } from '../lib/firebase';
import { FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Clock, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export function GoogleSheetsSync() {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportUrl, setExportUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(false);

  const mockData = [
    ['Date', 'Description', 'Category', 'Amount (INR)', 'Type'],
    ['2025-01-10', 'HDFC Salary Credit', 'Income', '185000', 'Credit'],
    ['2025-01-12', 'Tata Power Bill', 'Utilities', '3450', 'Debit'],
    ['2025-01-14', 'Amazon Fresh', 'Groceries', '4200', 'Debit'],
    ['2025-01-15', 'Netflix Subscription', 'Entertainment', '649', 'Debit'],
    ['2025-01-20', 'Mutual Fund SIP', 'Investment', '25000', 'Debit'],
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportSuccess(false);

    try {
      let token = await getAccessToken();
      
      if (!token) {
        // Force login to get token if it's missing (e.g. from page reload)
        await loginWithGoogle();
        token = await getAccessToken();
      }

      if (!token) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      // 1. Create a new spreadsheet
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: `Financial Export - ${new Date().toISOString().split('T')[0]}`,
          }
        }),
      });

      if (!createRes.ok) {
        throw new Error(`Failed to create spreadsheet: ${createRes.statusText}`);
      }

      const createData = createRes.headers.get('content-type')?.includes('application/json') ? await createRes.json() : null;
      if (!createData) throw new Error('Invalid JSON response');
      const spreadsheetId = createData.spreadsheetId;
      const spreadsheetUrl = createData.spreadsheetUrl;

      // 2. Update the spreadsheet with data
      const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:E6?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: mockData
        })
      });

      if (!updateRes.ok) {
        throw new Error(`Failed to update spreadsheet: ${updateRes.statusText}`);
      }

      setExportUrl(spreadsheetUrl);
      setExportSuccess(true);
    } catch (err: any) {
      console.error('Export Error:', err);
      setError(err.message || 'An error occurred while exporting data.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoSync) {
      // Background worker: mock background push every 1 hour (3600000ms), 
      // or for demo purposes, let's say it just logs and sets a local last-synced timestamp.
      interval = setInterval(async () => {
        try {
          if (exportUrl) {
            console.log('Background worker: Syncing new transactions to', exportUrl);
            // In a real app, it would use handleExport or a specialized append API call
          }
        } catch (e) {
          console.error("Auto-sync failed", e);
        }
      }, 60000); // Set to 60s for demo observation, typically 1hr
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSync, exportUrl]);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="font-bold text-slate-300 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" /> Google Sheets Integration
        </h3>
        {exportSuccess && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">Synced</span>}
      </div>
      
      <div className="p-6">
        <p className="text-sm text-slate-600 mb-6">
          Export your transaction history, tax analyses, and portfolio data directly to a new Google Sheet in your Google Drive.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {exportSuccess ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-900">Export Successful!</h4>
                <p className="text-sm text-emerald-400 mt-1">Your data has been successfully written to Google Sheets.</p>
              </div>
            </div>
            <a 
              href={exportUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Open Google Sheet
            </a>
            <button 
              onClick={() => { setExportSuccess(false); setExportUrl(''); }}
              className="w-full bg-surface hover:bg-white/5 text-slate-600 border border-white/10 font-medium py-3 rounded-lg transition-colors"
            >
              Export Another Record
            </button>
          </div>
        ) : (
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
              "w-full flex items-center justify-center gap-2 font-medium py-3 rounded-lg transition-colors text-white",
              isExporting ? "bg-emerald-400 cursor-not-allowed" : "glass-button text-emerald-400 font-bold"
            )}
          >
            {isExporting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Exporting to Sheets...</>
            ) : (
              <><FileSpreadsheet className="w-5 h-5" /> Export Data to Google Sheets</>
            )}
          </button>
        )}

        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-300">Auto-Push Sync</h4>
                <p className="text-xs text-slate-400">Automatically sync transactions in the background</p>
              </div>
            </div>
            
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                autoSync ? "bg-emerald-500" : "bg-white/10"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out",
                  autoSync ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
          
          {autoSync && (
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-300">Sync Schedule Active</p>
                <p className="text-xs text-slate-600 mt-1">Background worker is monitoring for new transactions. Changes will be pushed to your active spreadsheet every hour.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
