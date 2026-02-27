import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { Proposal } from '../types'

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: proposal, isLoading } = useQuery({
    queryKey: ['proposal', id],
    queryFn: () => apiClient.get(`/api/proposals/${id}`).then(r => r.data),
  })

  if (isLoading) {
    return <div className="text-center py-12">Načítání...</div>
  }

  if (!proposal) {
    return <div className="text-center py-12">Návrh nenalezen</div>
  }

  const proVotes = proposal.votes?.filter((v: any) => v.vote === 'PRO') || []
  const againstVotes = proposal.votes?.filter((v: any) => v.vote === 'PROTI') || []

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-black/60 mb-4">
          <Link to="/proposals" className="text-primary">Hlasování</Link>
          <span>/</span>
          <span>{proposal.title}</span>
        </div>
        <h1 className="text-4xl font-normal mb-4">{proposal.title}</h1>
        <p className="text-black/60">{proposal.description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/10 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-normal mb-4">Hlasování</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-black/60">Pro</span>
                <span className="text-lg text-green-700">{proVotes.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {proVotes.map((vote: any) => (
                  <div
                    key={vote.id}
                    className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold"
                    title={vote.councillor?.name}
                  >
                    {vote.councillor?.name?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-black/60">Proti</span>
                <span className="text-lg text-red-700">{againstVotes.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {againstVotes.map((vote: any) => (
                  <div
                    key={vote.id}
                    className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold"
                    title={vote.councillor?.name}
                  >
                    {vote.councillor?.name?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
