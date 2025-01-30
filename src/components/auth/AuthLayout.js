'use client';

import React from 'react';
import { HandshakeIcon } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/11.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and brand name */}
          <div className="flex items-center justify-center mb-8 space-x-2">
            <HandshakeIcon className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">SyncScrap</h1>
          </div>
          
          {/* Glass card effect */}
          <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-2xl border border-white/20">
            {children}
          </div>

          {/* Product features */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-white/80 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                <span className="text-blue-400">✓</span>
              </div>
              <p>Real-time collaborative web scraping</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                <span className="text-blue-400">✓</span>
              </div>
              <p>File tree structure visualization</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                <span className="text-blue-400">✓</span>
              </div>
              <p>Team management & sharing</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                <span className="text-blue-400">✓</span>
              </div>
              <p>Real-time content editing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}