import type { Metadata } from 'next'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: "A selection of projects I've built or contributed to.",
}

export default function ProjectsPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">Projects</h1>
        <p className="mb-12 text-neutral-400">
          A selection of things I&apos;ve built — side-projects, open-source tools, and professional work.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
