import Hero from '@/components/Hero'
import About from '@/components/About'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'
import { projects } from '@/data/projects'

export default function HomePage() {
  const featured = projects.filter((p) => p.featured)

  return (
    <>
      <Hero />
      <About />

      {/* Featured projects teaser */}
      <section className="border-t border-neutral-800 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-white">Featured Projects</h2>
            <Link href="/projects" className="text-sm text-neutral-400 hover:text-white">
              All projects →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
