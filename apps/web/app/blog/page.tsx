import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software engineering, cloud infrastructure, and technology.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">Blog</h1>
        <p className="mb-12 text-neutral-400">
          Thoughts on software engineering, cloud infrastructure, and technology.
        </p>

        {posts.length === 0 ? (
          <p className="text-neutral-500">No posts yet — check back soon.</p>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <time className="text-xs text-neutral-500">{post.date}</time>
                  <h2 className="mt-1 text-xl font-semibold text-white group-hover:text-neutral-300">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-neutral-400">{post.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
