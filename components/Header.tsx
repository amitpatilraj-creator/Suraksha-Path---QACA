
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-700 text-white py-6 px-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg">
            <i className="fas fa-shield-alt text-indigo-700 text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Suraksha Path</h1>
            <p className="text-xs text-indigo-100 opacity-80">QACA Field Safety Monitor</p>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="text-right">
            <span className="text-sm font-medium">Standard Operating Procedure</span>
            <div className="flex space-x-1 justify-end mt-1">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
