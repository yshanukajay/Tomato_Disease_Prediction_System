import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800/80 relative z-10 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍅</span>
            <span className="text-white font-display font-bold text-lg tracking-tight">TomoVision</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Next-generation AI diagnostic systems for modern agriculture. Instantly detect leaf pathogens using advanced neural networks.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#demo" className="hover:text-brand-400 transition-colors">Analyzer</a></li>
            <li><a href="#library" className="hover:text-brand-400 transition-colors">Pathogen Library</a></li>
            <li><a href="#how-it-works" className="hover:text-brand-400 transition-colors">Methodology</a></li>
            <li><a href="#features" className="hover:text-brand-400 transition-colors">Core Features</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Enterprise</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#" className="hover:text-brand-400 transition-colors font-medium text-slate-500 cursor-not-allowed">API Access (Coming Soon)</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors font-medium text-slate-500 cursor-not-allowed">Commercial Pricing</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Developer Docs</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Security & Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Technology</h4>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-brand-400 font-semibold shadow-inner">
              🤖 TensorFlow Core
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-lime-400 font-semibold shadow-inner ml-2">
              ⚡ EfficientNet-B0
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Trained on high-resolution crop imagery datasets.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800/80 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} TomoVision Inc. All rights reserved. Designed for precision agriculture.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
