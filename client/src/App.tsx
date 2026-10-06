import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-glass p-8 text-center border border-slate-100">
        <div className="w-16 h-16 bg-agro-100 text-agro-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">CropAdvisor</h1>
        <p className="text-slate-600 text-sm">
          AI-Powered Agriculture Advisory Application
        </p>
      </div>
    </div>
  );
}
