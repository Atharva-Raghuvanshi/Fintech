/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { ExecutionLayer } from './components/ExecutionLayer';
import { TaxAdvisory } from './components/TaxAdvisory';
import { FamilyGraph } from './components/FamilyGraph';
import { GoalPlanner } from './components/GoalPlanner';
import { BankTransactions } from './components/BankTransactions';
import { AIRecommendations } from './components/AIRecommendations';
import { TradeHistory } from './components/TradeHistory';
import { ConsistencyDashboard } from './components/ConsistencyDashboard';
import { GoogleSheetsSync } from './components/GoogleSheetsSync';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';

function DataExportWrapper() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Data Export & Sync</h1>
        <p className="text-slate-400 mt-1">Export your financial data to external services</p>
      </div>
      <GoogleSheetsSync />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [privacyToggleRender, setPrivacyToggleRender] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const handlePrivacyToggle = () => setPrivacyToggleRender(prev => prev + 1);
    window.addEventListener('privacy-toggle', handlePrivacyToggle);
    return () => window.removeEventListener('privacy-toggle', handlePrivacyToggle);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-base flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-base text-text-primary">
        <Sidebar />
        <div className="flex-1 ml-[64px] flex flex-col h-screen overflow-y-auto" key={privacyToggleRender}>
          <Topbar />
          <main className="flex-1">
            <div className="max-w-[1600px] mx-auto p-4 min-h-full">
              <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/banking" element={<BankTransactions />} />
            <Route path="/family" element={<FamilyGraph />} />
            <Route path="/goals" element={<GoalPlanner />} />
            <Route path="/execution" element={<ExecutionLayer />} />
            <Route path="/trades" element={<TradeHistory />} />
            <Route path="/audit" element={<ConsistencyDashboard />} />
            <Route path="/tax" element={<TaxAdvisory />} />
            <Route path="/insights" element={<AIRecommendations />} />
            <Route path="/export" element={<DataExportWrapper />} />
            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
