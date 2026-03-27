import Link from 'next/link'
import type { Project } from '@/data/projects'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-700">
      <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
      <p className="mb-4 flex-1 text-sm text-neutral-400">{project.description}</p>
      <ul className="mb-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li key={tech} className="text-xs text-neutral-500">
            {tech}
          </li>
        ))}
      </ul>
      <div className="flex gap-4">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-neutral-300 underline-offset-4 hover:underline"
          >
            Source
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-neutral-300 underline-offset-4 hover:underline"
          >
            Live
          </a>
        )}
        {project.slug && (
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-medium text-neutral-300 underline-offset-4 hover:underline"
          >
            Read more →
          </Link>
        )}
      </div>
    </div>
  )
}
