
import React, { useState, useRef, useEffect } from 'react';
import { TravelMode, TimeOfDay, SafetyChecklist, StaffLocation } from '../types';

interface SafetyFormProps {
  onSubmit: (data: SafetyChecklist) => void;
  isLoading: boolean;
}

const SafetyForm: React.FC<SafetyFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SafetyChecklist>({
    staffName: '',
    staffPhone: '',
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

  const [locationStatus, setLocationStatus] = useState<'idle' | 'getting' | 'success' | 'error'>('idle');
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.staffName || !formData.staffPhone) {
      alert("Please enter Name and Phone Number");
      return;
    }
    if (!formData.selfie) {
      alert("Please capture a selfie for verification");
      return;
    }
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

  const handleGetLocation = () => {
    setLocationStatus('getting');
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }));
        setLocationStatus('success');
      },
      () => setLocationStatus('error')
    );
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setShowCamera(false);
      alert("Unable to access camera.");
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, selfie: base64 }));
        
        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Safety Declaration</h2>
        <p className="text-slate-500">Verify identity and site conditions before travel.</p>
      </div>

      {/* Staff Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
        <div className="col-span-full mb-2">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Identity Verification</h3>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Full Name</label>
          <input
            type="text"
            required
            placeholder="Enter your name"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.staffName}
            onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Phone Number</label>
          <input
            type="tel"
            required
            placeholder="+91 XXXXX XXXXX"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.staffPhone}
            onChange={(e) => setFormData({ ...formData, staffPhone: e.target.value })}
          />
        </div>

        {/* Selfie Section */}
        <div className="col-span-full">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Staff Selfie (Mandatory)</label>
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white min-h-[160px]">
            {formData.selfie && !showCamera ? (
              <div className="relative group">
                <img src={formData.selfie} alt="Selfie" className="w-32 h-32 rounded-xl object-cover shadow-md" />
                <button
                  type="button"
                  onClick={startCamera}
                  className="absolute -top-2 -right-2 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                >
                  <i className="fas fa-sync-alt text-xs"></i>
                </button>
              </div>
            ) : showCamera ? (
              <div className="flex flex-col items-center space-y-4">
                <video ref={videoRef} autoPlay playsInline className="w-full max-w-xs rounded-xl shadow-lg" />
                <button
                  type="button"
                  onClick={captureSelfie}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full flex items-center space-x-2 transition-all"
                >
                  <i className="fas fa-camera"></i>
                  <span>Snap Photo</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="flex flex-col items-center space-y-2 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <i className="fas fa-camera-retro text-4xl"></i>
                <span className="text-sm font-semibold">Take Selfie</span>
              </button>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        {/* Location Section */}
        <div className="col-span-full">
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <i className={`fas fa-map-marker-alt ${locationStatus === 'success' ? 'text-green-500' : 'text-slate-400'} text-xl`}></i>
              <div>
                <p className="text-sm font-bold text-slate-700">Live Location</p>
                <p className="text-xs text-slate-500">
                  {locationStatus === 'success' 
                    ? `Lat: ${formData.location?.latitude.toFixed(4)}, Lng: ${formData.location?.longitude.toFixed(4)}`
                    : locationStatus === 'getting' 
                    ? 'Retrieving coordinates...' 
                    : 'Location required for validation'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationStatus === 'getting'}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {locationStatus === 'success' ? 'Update Location' : 'Get Location'}
            </button>
          </div>
        </div>
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
            <span>Verifying multimodal data...</span>
          </>
        ) : (
          <>
            <i className="fas fa-shield-check"></i>
            <span>Authenticate & Submit</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SafetyForm;
