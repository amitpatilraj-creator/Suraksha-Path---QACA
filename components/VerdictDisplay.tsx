
import React from 'react';
import { SafetyVerdict } from '../types';

interface VerdictDisplayProps {
  verdict: SafetyVerdict;
  onReset: () => void;
}

const VerdictDisplay: React.FC<VerdictDisplayProps> = ({ verdict, onReset }) => {
  const isSafe = verdict.verdict === 'SAFE';
  const isUnsafe = verdict.verdict === 'UNSAFE';
  
  const getStatusColor = () => {
    if (isSafe) return 'text-green-600 border-green-600 bg-green-50';
    if (isUnsafe) return 'text-red-600 border-red-600 bg-red-50';
    return 'text-amber-600 border-amber-600 bg-amber-50';
  };

  const getIcon = () => {
    if (isSafe) return 'fa-check-circle';
    if (isUnsafe) return 'fa-exclamation-triangle';
    return 'fa-info-circle';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className={`p-8 rounded-3xl border-2 text-center ${getStatusColor()} shadow-inner`}>
        <i className={`fas ${getIcon()} text-6xl mb-4`}></i>
        <h2 className="text-3xl font-black uppercase tracking-widest">{verdict.verdict}</h2>
        <div className="mt-2 text-lg font-medium opacity-90">Safety Score: {verdict.score}%</div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <i className="fas fa-brain mr-2 text-indigo-500"></i>
          Analysis Reasoning
        </h3>
        <p className="text-slate-600 leading-relaxed italic mb-6">
          "{verdict.reasoning}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <span className="w-2 h-4 bg-red-500 rounded-full mr-2"></span>
              Identified Risk Factors
            </h4>
            <ul className="space-y-3">
              {verdict.riskFactors.map((risk, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-700">
                  <i className="fas fa-times-circle text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <span className="w-2 h-4 bg-green-500 rounded-full mr-2"></span>
              Recommendations
            </h4>
            <ul className="space-y-3">
              {verdict.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-700">
                  <i className="fas fa-lightbulb text-amber-500 mt-1 mr-2 flex-shrink-0"></i>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onReset}
          className="mt-8 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
        >
          Modify Assessment
        </button>
      </div>
      
      {isUnsafe && (
        <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg animate-pulse flex items-center space-x-4">
          <i className="fas fa-phone-alt text-3xl"></i>
          <div>
            <h4 className="font-bold">Emergency Protocol</h4>
            <p className="text-sm opacity-90">Please contact your site supervisor immediately. Do not proceed until you receive formal clearance.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerdictDisplay;
