import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { Proposal, Party, Councillor } from '../types'
import ProposalCard from '../components/ProposalCard'

const MUNICIPALITY_ID = 'lukavice' // Bude se nastavit dynamicky

export default function Home() {
  const { data: proposals } = useQuery({
    queryKey: ['proposals', MUNICIPALITY_ID],
    queryFn: () =>
      apiClient.get(`/api/municipalities/${MUNICIPALITY_ID}/proposals`).then(r => r.data),
  })

  const { data: parties } = useQuery({
    queryKey: ['parties', MUNICIPALITY_ID],
    queryFn: () =>
      apiClient.get(`/api/municipalities/${MUNICIPALITY_ID}/parties`).then(r => r.data),
  })

  const { data: councillors } = useQuery({
    queryKey: ['councillors', MUNICIPALITY_ID],
    queryFn: () =>
      apiClient.get(`/api/municipalities/${MUNICIPALITY_ID}/councillors`).then(r => r.data),
  })

  const activeCouncillors = councillors?.filter((c: Councillor) => c.active) || []
  const partyCounts: Record<string, number> = {}

  activeCouncillors.forEach((councillor: Councillor) => {
    const partyId = councillor.partyId || 'independent'
    partyCounts[partyId] = (partyCounts[partyId] || 0) + 1
  })

  const recentProposals = proposals?.slice(0, 3) || []

  return (
    <div className="space-y-12">
      {/* Composition */}
      <div className="bg-white rounded-3xl border border-black/10 p-6 space-y-6">
        <div className="flex flex-wrap justify-center gap-8">
          {parties?.map((party: Party) => {
            const count = partyCounts[party.id] || 0
            if (count === 0) return null
            return (
              <div key={party.id} className="flex flex-col items-center gap-2">
                <span className="text-lg text-black/60">{party.name}</span>
                <span className="text-lg" style={{ color: party.color }}>
                  {count}
                </span>
              </div>
            )
          })}
        </div>

        {/* Visualization */}
        <div className="flex flex-wrap justify-center gap-2">
          {parties?.map((party: Party) => {
            const count = partyCounts[party.id] || 0
            return Array.from({ length: count }).map((_, i) => (
              <div
                key={`${party.id}-${i}`}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: party.color }}
              ></div>
            ))
          })}
        </div>
      </div>

      {/* Recent Proposals */}
      <div>
        <h2 className="text-4xl font-normal mb-6">Poslední hlasování</h2>
        <div className="space-y-4">
          {recentProposals.map((proposal: Proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </div>
  )
}
