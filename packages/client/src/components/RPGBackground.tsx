import * as React from 'react';

export default function RPGBackground() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Game Map Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
              <defs>
                <pattern id="terrain" patternUnits="userSpaceOnUse" width="60" height="60">
                  <circle cx="30" cy="30" r="2" fill="#4ade80" opacity="0.3"/>
                  <circle cx="10" cy="10" r="1" fill="#22c55e" opacity="0.2"/>
                  <circle cx="50" cy="20" r="1.5" fill="#16a34a" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#terrain)"/>
              <path d="M100,400 Q300,200 500,350 T900,300 L1200,250 L1200,800 L0,800 Z" fill="#065f46" opacity="0.3"/>
              <circle cx="200" cy="300" r="40" fill="#1f2937" opacity="0.5"/>
              <circle cx="800" cy="200" r="60" fill="#374151" opacity="0.4"/>
              <rect x="600" y="500" width="80" height="60" fill="#7c2d12" opacity="0.4"/>
            </svg>
          `)}`,
        }}
      />
    </div>
  );
} 