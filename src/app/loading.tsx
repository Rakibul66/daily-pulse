export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading application...</p>
      </div>
    </div>
  );
}
