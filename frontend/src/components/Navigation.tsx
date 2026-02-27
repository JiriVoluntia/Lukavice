import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black/10 z-50">
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain" />
          <div className="flex flex-col">
            <div className="text-2xl font-normal text-dark">Obec Lukavice</div>
            <div className="text-lg font-normal text-dark">Pardubický kraj</div>
          </div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden lg:flex gap-8 items-center">
          <Link
            to="/proposals"
            className={`flex items-center gap-2 text-lg no-underline transition ${
              isActive('/proposals') ? 'text-dark' : 'text-black/60 hover:text-dark'
            }`}
          >
            <img src="/icons/hlasovani.svg" alt="Hlasování" className="w-6 h-6" />
            <span>Hlasování</span>
          </Link>
          <Link
            to="/councillors"
            className={`flex items-center gap-2 text-lg no-underline transition ${
              isActive('/councillors') ? 'text-dark' : 'text-black/60 hover:text-dark'
            }`}
          >
            <img src="/icons/zastupitele.svg" alt="Zastupitelé" className="w-6 h-6" />
            <span>Zastupitelé</span>
          </Link>
          <a
            href="https://www.obeclukavice.cz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg text-black/60 hover:text-dark no-underline transition"
          >
            <img src="/icons/Web.svg" alt="Web" className="w-6 h-6" />
            <span>Web</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden flex flex-col gap-1.5 bg-transparent border-0 cursor-pointer p-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`w-6 h-0.5 bg-dark transition ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-dark transition ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-dark transition ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-black/10">
          <Link
            to="/proposals"
            className="flex items-center gap-2 px-4 py-4 text-lg text-dark no-underline border-b border-black/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/icons/hlasovani.svg" alt="Hlasování" className="w-6 h-6" />
            <span>Hlasování</span>
          </Link>
          <Link
            to="/councillors"
            className="flex items-center gap-2 px-4 py-4 text-lg text-dark no-underline border-b border-black/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/icons/zastupitele.svg" alt="Zastupitelé" className="w-6 h-6" />
            <span>Zastupitelé</span>
          </Link>
          <a
            href="https://www.obeclukavice.cz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-4 text-lg text-dark no-underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/icons/Web.svg" alt="Web" className="w-6 h-6" />
            <span>Web</span>
          </a>
        </div>
      )}
    </nav>
  )
}
