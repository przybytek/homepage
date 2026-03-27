export interface Project {
  title: string
  description: string
  stack: string[]
  repo?: string
  live?: string
  slug?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    title: 'przybytek.com',
    description:
      'This site — a personal homepage built with Next.js 15, Tailwind CSS v4, and deployed to AWS via CDK. ECS Fargate + CloudFront + Route 53.',
    stack: ['Next.js', 'Tailwind CSS', 'TypeScript', 'AWS CDK', 'ECS Fargate', 'CloudFront'],
    repo: 'https://github.com/przybo/homepage',
    live: 'https://przybytek.com',
    featured: true,
  },
  {
    title: 'Example Project',
    description:
      'A placeholder for your next project. Describe what problem it solves and what makes it interesting.',
    stack: ['TypeScript', 'Node.js', 'PostgreSQL'],
    repo: 'https://github.com/przybo',
    featured: true,
  },
]
