import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('setup')
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    localStorage.removeItem('firebaseToken')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-light">
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black/10 z-50">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain" />
            <div className="flex flex-col">
              <div className="text-2xl font-normal text-dark">Obec Lukavice</div>
              <div className="text-lg font-normal text-dark">Administrátor</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-danger text-white rounded-lg font-normal hover:bg-danger/90 transition"
          >
            Odhlásit se
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        <h1 className="text-4xl font-normal text-center mb-12">Nastavte váš portál:</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Obec', description: 'Nastavte logo, název a ostatní důležitá data vaší obce' },
            { title: 'Příslušnost', description: 'Vytvořte jednotlivé strany a přidejte jim jejich barvu' },
            { title: 'Zastupitelé', description: 'Přidejte zastupitele a upravte jejich biografii' },
            { title: 'Hlasování', description: 'Vyplňte jednotlivá hlasování a účast zastupitelů' },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col gap-4 text-center"
            >
              <div className="text-black/60">Krok {i + 1}.</div>
              <h2 className="text-2xl font-normal">{step.title}</h2>
              <p className="text-black/60 flex-1">{step.description}</p>
              <button className="px-4 py-2 bg-dark text-white rounded-2xl font-normal hover:bg-dark/90 transition">
                Nastavit
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="text-primary text-lg no-underline hover:underline">
            Potřebuji pomoc.
          </a>
        </div>
      </main>
    </div>
  )
}
