import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      localStorage.setItem('firebaseToken', token)
      navigate('/admin')
    } catch (err: any) {
      setError('Nesprávný email nebo heslo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-black/10 p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 mb-8">
          <img src="/logo.png" alt="Logo" className="w-20 h-20" />
          <h1 className="text-2xl font-normal text-dark">Administrátor</h1>
          <p className="text-black/60">Přihlášení do administračního panelu</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-normal text-dark mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="váš email"
              className="w-full px-3 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-dark mb-2">Heslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="vaše heslo"
              className="w-full px-3 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-success text-white rounded-lg font-normal hover:bg-success/90 disabled:opacity-50 transition"
          >
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-primary text-sm no-underline hover:underline">
            Zpět na hlavní stránku
          </a>
        </div>
      </div>
    </div>
  )
}
