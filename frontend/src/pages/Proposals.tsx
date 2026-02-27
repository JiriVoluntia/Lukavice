import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { Proposal } from '../types'
import ProposalCard from '../components/ProposalCard'

const MUNICIPALITY_ID = 'lukavice'

export default function Proposals() {
  const { data: proposals, isLoading } = useQuery({
    queryKey: ['proposals', MUNICIPALITY_ID],
    queryFn: () =>
      apiClient.get(`/api/municipalities/${MUNICIPALITY_ID}/proposals`).then(r => r.data),
  })

  if (isLoading) {
    return <div className="text-center py-12">Načítání...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-normal mb-8">Hlasování</h1>
      <div className="space-y-4">
        {proposals?.map((proposal: Proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  )
}
