import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white text-black">
      <div className="flex flex-col items-center gap-3 p-8 border-4 border-black bg-white shadow-[8px_8px_0px_#000]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin stroke-[3]" />
        <p className="text-xs font-black text-black uppercase tracking-wider">
          Loading Shomporko CRM...
        </p>
      </div>
    </div>
  );
}
