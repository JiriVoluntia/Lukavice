import { Link } from 'react-router-dom'
import { Proposal } from '../types'

interface ProposalCardProps {
  proposal: Proposal
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const isApproved = proposal.result === 'SCHVÁLENO'
  const proVotes = proposal.votes?.filter(v => v.vote === 'PRO').length || 0
  const againstVotes = proposal.votes?.filter(v => v.vote === 'PROTI').length || 0

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Dnes'
    if (diffDays === 1) return 'Včera'
    if (diffDays < 7) return `Před ${diffDays} dny`
    if (diffDays < 30) return `Před ${Math.floor(diffDays / 7)} týdnem`
    if (diffDays < 365) return `Před ${Math.floor(diffDays / 30)} měsícem`
    return `Před ${Math.floor(diffDays / 365)} rokem`
  }

  return (
    <Link
      to={`/proposals/${proposal.id}`}
      className="block bg-white rounded-2xl border border-black/10 p-6 no-underline hover:border-black/20 transition"
    >
      <div className="flex justify-between items-start gap-4 mb-4">
        <div
          className={`px-3 py-2 rounded-full text-lg ${
            isApproved
              ? 'bg-green-500/60 text-black/60'
              : 'bg-red-500/60 text-black/60'
          }`}
        >
          {isApproved ? 'Schváleno' : 'Zamítnuto'}
        </div>
        <div className="flex items-center gap-2 text-black/60">
          <span>{getTimeAgo(proposal.date)}</span>
          <img src="/icons/Datum.svg" alt="Datum" className="w-6 h-6" />
        </div>
      </div>

      <h3 className="text-2xl font-normal mb-4 text-dark">{proposal.title}</h3>

      <div className="flex justify-between items-end gap-4">
        <div className="text-black/60">
          <span className="text-lg">Navrhl </span>
          <span className="text-primary">{proposal.proposerId || 'Neznámý'}</span>
        </div>
        <div className="flex flex-col gap-2 text-right">
          <div className="flex items-center gap-2">
            <span className="text-black/60">Pro</span>
            <span className="text-lg text-green-700">{proVotes}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-black/60">Proti</span>
            <span className="text-lg text-red-700">{againstVotes}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
