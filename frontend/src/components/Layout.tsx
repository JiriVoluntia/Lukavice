import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'

export default function Layout() {
  return (
    <div className="min-h-screen bg-light">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        <Outlet />
      </main>
    </div>
  )
}
