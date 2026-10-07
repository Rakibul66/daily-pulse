import Link from "next/link";
import { FileQuestion, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-6 text-black selection:bg-indigo-600 selection:text-white">
      <div className="flex max-w-md flex-col items-center text-center p-8 border-4 border-black bg-[#FFFDF0] shadow-[10px_10px_0px_#000]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center border-3 border-black bg-amber-300 shadow-[3px_3px_0px_#000]">
          <FileQuestion className="h-8 w-8 text-black stroke-[2.5]" />
        </div>
        <h2 className="mb-2 font-display font-black text-3xl uppercase tracking-tight text-black">
          Page Not Found
        </h2>
        <p className="mb-6 text-xs font-bold uppercase tracking-wider text-slate-600 leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          GO BACK HOME <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}
