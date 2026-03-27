'use client'

import { useActionState } from 'react'
import { sendContactMessage } from './actions'

const initialState = { success: false, error: '' }

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState)

  return (
    <section className="py-24">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">Contact</h1>
        <p className="mb-10 text-neutral-400">
          Have a question or want to work together? Send me a message.
        </p>

        {state.success ? (
          <div className="rounded-lg border border-green-800 bg-green-950 p-6 text-green-300">
            Message sent! I&apos;ll get back to you soon.
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            {state.error && (
              <div className="rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-300">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-neutral-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={2000}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                placeholder="Tell me what's on your mind..."
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
