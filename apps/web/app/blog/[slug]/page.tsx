import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-10">
          <time className="text-xs text-neutral-500">{post.date}</time>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg text-neutral-400">{post.excerpt}</p>}
        </header>
        <div className="prose prose-invert prose-neutral max-w-none">
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  )
}
