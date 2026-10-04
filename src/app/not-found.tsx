import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <FileQuestion className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-800">Page not found</h2>
        <p className="mb-6 text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
