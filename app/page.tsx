export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-[2rem] border border-black/10 bg-white/85 px-8 py-14 text-center shadow-[0_24px_80px_rgba(66,57,45,0.12)] backdrop-blur sm:px-12">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Chicago Seasonal Social
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-7xl">
          WhyNot
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-[color:rgba(37,34,30,0.82)]">
          No swiping. Just sign up and show up.
        </p>
        <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-[color:rgba(37,34,30,0.68)]">
          Planning foundation complete. Product build begins next.
        </p>
      </section>
    </main>
  );
}
