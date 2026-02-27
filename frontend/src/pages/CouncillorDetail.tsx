import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export default function CouncillorDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: councillor, isLoading } = useQuery({
    queryKey: ['councillor', id],
    queryFn: () => apiClient.get(`/api/councillors/${id}`).then(r => r.data),
  })

  if (isLoading) {
    return <div className="text-center py-12">Načítání...</div>
  }

  if (!councillor) {
    return <div className="text-center py-12">Zastupitel nenalezen</div>
  }

  const proVotes = councillor.votes?.filter((v: any) => v.vote === 'PRO') || []
  const againstVotes = councillor.votes?.filter((v: any) => v.vote === 'PROTI') || []

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-black/60 mb-4">
          <Link to="/councillors" className="text-primary">Zastupitelé</Link>
          <span>/</span>
          <span>{councillor.name}</span>
        </div>
        <div className="flex gap-6 items-start">
          <div className="w-32 h-32 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-4xl font-semibold">
            {councillor.name?.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-4xl font-normal mb-2">{councillor.name}</h1>
            {councillor.party && (
              <p className="text-lg text-dark mb-2">{councillor.party.name}</p>
            )}
            {councillor.function && (
              <p className="text-black/60 mb-4">{councillor.function}</p>
            )}
            {councillor.bio && (
              <p className="text-black/60">{councillor.bio}</p>
            )}
          </div>
        </div>
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
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-black/60">Proti</span>
                <span className="text-lg text-red-700">{againstVotes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
