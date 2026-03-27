export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-sm text-neutral-500 sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Przybytek. All rights reserved.</p>
        <ul className="flex gap-5">
          <li>
            <a
              href="https://github.com/przybo"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/przybytek"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
