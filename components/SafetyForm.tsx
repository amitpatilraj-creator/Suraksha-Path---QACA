
import React, { useState } from 'react';
import { TravelMode, TimeOfDay, SafetyChecklist } from '../types';

interface SafetyFormProps {
  onSubmit: (data: SafetyChecklist) => void;
  isLoading: boolean;
}

const SafetyForm: React.FC<SafetyFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SafetyChecklist>({
    mode: TravelMode.BIKE,
    distance: 10,
    time: TimeOfDay.DAYTIME,
    hasValidLicense: true,
    isWearingPPE: true,
    ppeDetails: ['Helmet'],
    performedVehicleCheck: true,
    weatherCondition: 'Clear',
    isFatigued: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePPE = (item: string) => {
    setFormData(prev => ({
      ...prev,
      ppeDetails: prev.ppeDetails.includes(item)
        ? prev.ppeDetails.filter(i => i !== item)
        : [...prev.ppeDetails, item]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Safety Declaration</h2>
        <p className="text-slate-500">Fill in the travel details for your current deployment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Travel Mode */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Mode of Transport</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value as TravelMode })}
            >
              {Object.values(TravelMode).map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
            <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
          </div>
        </div>

        {/* Time of Day */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Travel Timing</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value as TimeOfDay })}
            >
              {Object.values(TimeOfDay).map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <i className="fas fa-clock absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Distance to Travel (km)</label>
          <input
            type="number"
            min="1"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
          />
        </div>

        {/* Weather */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Weather Condition</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              value={formData.weatherCondition}
              onChange={(e) => setFormData({ ...formData, weatherCondition: e.target.value })}
            >
              <option value="Clear">Clear Sky</option>
              <option value="Rainy">Rainy / Monsoon</option>
              <option value="Foggy">Foggy / Low Visibility</option>
              <option value="Hot">Extreme Heat</option>
              <option value="Windy">High Winds</option>
            </select>
            <i className="fas fa-cloud absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Safety Checks & PPE</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.hasValidLicense ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
            <input
              type="checkbox"
              className="hidden"
              checked={formData.hasValidLicense}
              onChange={(e) => setFormData({ ...formData, hasValidLicense: e.target.checked })}
            />
            <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 ${formData.hasValidLicense ? 'bg-green-500' : 'bg-slate-300'}`}>
              {formData.hasValidLicense && <i className="fas fa-check text-white text-xs"></i>}
            </div>
            <span className="text-sm font-medium text-slate-700">Valid Driving License</span>
          </label>

          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.performedVehicleCheck ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
            <input
              type="checkbox"
              className="hidden"
              checked={formData.performedVehicleCheck}
              onChange={(e) => setFormData({ ...formData, performedVehicleCheck: e.target.checked })}
            />
            <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 ${formData.performedVehicleCheck ? 'bg-green-500' : 'bg-slate-300'}`}>
              {formData.performedVehicleCheck && <i className="fas fa-check text-white text-xs"></i>}
            </div>
            <span className="text-sm font-medium text-slate-700">Pre-check of Vehicle Done</span>
          </label>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <span className="block text-sm font-medium text-slate-600 mb-3">Which PPE are you currently wearing?</span>
          <div className="flex flex-wrap gap-2">
            {['Helmet', 'Seatbelt', 'Safety Boots', 'Reflective Vest', 'Gloves'].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => togglePPE(item)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${formData.ppeDetails.includes(item) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-300'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.isFatigued ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
          <input
            type="checkbox"
            className="hidden"
            checked={formData.isFatigued}
            onChange={(e) => setFormData({ ...formData, isFatigued: e.target.checked })}
          />
          <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 ${formData.isFatigued ? 'bg-red-500' : 'bg-slate-300'}`}>
            {formData.isFatigued && <i className="fas fa-check text-white text-xs"></i>}
          </div>
          <span className="text-sm font-medium text-slate-700">Feeling Fatigued / Lack of Sleep?</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 disabled:bg-indigo-400"
      >
        {isLoading ? (
          <>
            <i className="fas fa-circle-notch animate-spin"></i>
            <span>Analyzing Risks...</span>
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane"></i>
            <span>Submit Assessment</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SafetyForm;
