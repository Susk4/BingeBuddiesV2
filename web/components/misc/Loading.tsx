const Loading = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
        role="status"
        aria-label="Loading"
      />
      <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
        Loading
      </p>
    </div>
  );
};

export default Loading;
