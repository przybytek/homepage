import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt?: string
}

export interface Post extends PostMeta {
  content: string
}

export async function getAllPosts(): Promise<PostMeta[]> {
  let files: string[]
  try {
    files = await fs.readdir(POSTS_DIR)
  } catch {
    return []
  }

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith('.mdx'))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8')
        const { data } = matter(raw)
        return {
          slug: file.replace(/\.mdx$/, ''),
          title: data.title as string,
          date: data.date as string,
          excerpt: data.excerpt as string | undefined,
        }
      }),
  )

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: data.excerpt as string | undefined,
      content,
    }
  } catch {
    return null
  }
}
