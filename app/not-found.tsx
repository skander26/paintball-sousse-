import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="section container-pb flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <p className="pb-label">404</p>
      <h1 className="font-display text-4xl font-black uppercase tracking-wider text-[var(--text-primary)] md:text-5xl">
        Page introuvable
      </h1>
      <p className="max-w-md text-body-md text-[var(--text-secondary)]">
        Cette adresse n’existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-6 font-body text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)]"
      >
        Retour à l’accueil
      </Link>
    </main>
  )
}
