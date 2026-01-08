
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
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 md:text-4xl mb-2">
            Field Safety Protocol
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Mandatory daily safety assessment for field engineers operating across India.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center">
            <i className="fas fa-exclamation-circle mr-3"></i>
            {error}
          </div>
        )}

        {verdict ? (
          <VerdictDisplay verdict={verdict} onReset={handleReset} />
        ) : (
          <SafetyForm onSubmit={handleFormSubmit} isLoading={loading} />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-4 md:hidden flex justify-around text-slate-500 text-xs">
        <div className="flex flex-col items-center">
          <i className="fas fa-home text-lg mb-1"></i>
          <span>Home</span>
        </div>
        <div className="flex flex-col items-center text-indigo-600">
          <i className="fas fa-clipboard-check text-lg mb-1"></i>
          <span>Checklist</span>
        </div>
        <div className="flex flex-col items-center">
          <i className="fas fa-history text-lg mb-1"></i>
          <span>History</span>
        </div>
        <div className="flex flex-col items-center">
          <i className="fas fa-user text-lg mb-1"></i>
          <span>Profile</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
