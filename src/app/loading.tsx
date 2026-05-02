export default function RootLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="mx-auto grid min-h-[40vh] max-w-3xl place-items-center px-4 py-20 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <span
          aria-hidden
          className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-primary"
        />
        <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
          Chargement…
        </p>
      </div>
    </section>
  );
}
