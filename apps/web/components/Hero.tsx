import Link from 'next/link'

export default function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="mb-3 text-sm font-medium tracking-widest text-neutral-500 uppercase">
        Software Engineer
      </p>
      <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl">
        Hi, I&apos;m Przybytek.
      </h1>
      <p className="mb-10 max-w-2xl text-lg text-neutral-400">
        I build things for the web — full-stack apps, cloud infrastructure, and the occasional open-source
        project. Welcome to my corner of the internet.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/projects"
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90"
        >
          View Projects
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-200 transition-colors hover:border-neutral-500 hover:text-white"
        >
          Read Blog
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-200 transition-colors hover:border-neutral-500 hover:text-white"
        >
          Contact Me
        </Link>
      </div>
    </section>
  )
}
