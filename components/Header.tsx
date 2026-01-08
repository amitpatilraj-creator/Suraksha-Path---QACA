
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo Container */}
          <div className="flex-shrink-0">
            <img 
              src="https://www.qualityaustria.co.in/images/logo.png" 
              alt="Quality Austria Central Asia" 
              className="h-10 md:h-12 w-auto object-contain"
              onError={(e) => {
                // Fallback if the specific URL fails
                (e.target as HTMLImageElement).src = 'https://placehold.co/200x60/e11d48/white?text=QACA';
              }}
            />
          </div>
          
          <div className="border-l border-slate-200 pl-4 py-1">
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Suraksha Path</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Field Safety Monitor</p>
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Status</span>
            <div className="flex items-center justify-end space-x-2 mt-1">
              <span className="text-xs font-semibold text-slate-600 mr-1">SOP Active</span>
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
