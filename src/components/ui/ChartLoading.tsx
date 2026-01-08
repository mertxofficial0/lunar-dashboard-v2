export function ChartLoading() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/100 pointer-events-none">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        <span className="text-xs text-slate-500">
          Updating chart…
        </span>
      </div>
    </div>
  );
}
