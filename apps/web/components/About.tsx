const skills = [
  'TypeScript',
  'React / Next.js',
  'Node.js',
  'AWS',
  'Docker',
  'PostgreSQL',
  'Terraform / CDK',
  'Go',
]

export default function About() {
  return (
    <section id="about" className="border-t border-neutral-800 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="mb-10 text-3xl font-bold tracking-tight text-white">About Me</h2>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-neutral-400">
            <p>
              I&apos;m a software engineer with a passion for building reliable, scalable systems.
              I work across the full stack — from crafting polished React interfaces to designing
              cloud infrastructure on AWS.
            </p>
            <p>
              When I&apos;m not writing code, I enjoy photography, hiking, and exploring new places.
              This site is my personal space to share projects, write about technology, and
              connect with like-minded folks.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-widest text-neutral-500 uppercase">
              Tech I use
            </h3>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
