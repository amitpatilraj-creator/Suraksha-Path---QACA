
import React, { useState } from 'react';
import Header from './components/Header';
import SafetyForm from './components/SafetyForm';
import VerdictDisplay from './components/VerdictDisplay';
import { SafetyChecklist, SafetyVerdict } from './types';
import { analyzeSafety } from './services/geminiService';

const App: React.FC = () => {
  const [verdict, setVerdict] = useState<SafetyVerdict | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: SafetyChecklist) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSafety(data);
      setVerdict(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Unable to process safety check. Please ensure you have a valid internet connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVerdict(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            Compliance Module v3.1
          </div>
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl mb-3 tracking-tight">
            Safety Clearance Protocol
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Mandatory digital verification for all Quality Austria Central Asia field personnel. 
            All parameters must be validated before transit.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-center rounded-xl shadow-sm">
            <i className="fas fa-exclamation-circle mr-3"></i>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {verdict ? (
          <VerdictDisplay verdict={verdict} onReset={handleReset} />
        ) : (
          <SafetyForm onSubmit={handleFormSubmit} isLoading={loading} />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-4 md:hidden flex justify-around text-slate-400 text-xs">
        <div className="flex flex-col items-center">
          <i className="fas fa-home text-lg mb-1"></i>
          <span className="font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center text-indigo-600">
          <i className="fas fa-shield-check text-lg mb-1"></i>
          <span className="font-bold">Clearance</span>
        </div>
        <div className="flex flex-col items-center">
          <i className="fas fa-file-alt text-lg mb-1"></i>
          <span className="font-bold">Reports</span>
        </div>
        <div className="flex flex-col items-center">
          <i className="fas fa-user-circle text-lg mb-1"></i>
          <span className="font-bold">Account</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
