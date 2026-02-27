import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { apiClient } from '../api/client'
import { Councillor, Party } from '../types'

const MUNICIPALITY_ID = 'lukavice'

export default function Councillors() {
  const { data: councillors, isLoading } = useQuery({
    queryKey: ['councillors', MUNICIPALITY_ID],
    queryFn: () =>
      apiClient.get(`/api/municipalities/${MUNICIPALITY_ID}/councillors`).then(r => r.data),
  })

  const { data: parties } = useQuery({
    queryKey: ['parties', MUNICIPALITY_ID],
    queryFn: () =>
      apiClient.get(`/api/municipalities/${MUNICIPALITY_ID}/parties`).then(r => r.data),
  })

  if (isLoading) {
    return <div className="text-center py-12">Načítání...</div>
  }

  const activeCouncillors = councillors?.filter((c: Councillor) => c.active) || []
  const inactiveCouncillors = councillors?.filter((c: Councillor) => !c.active) || []

  const groupByParty = (councillors: Councillor[]) => {
    const grouped: Record<string, Councillor[]> = {}
    councillors.forEach(c => {
      const partyId = c.partyId || 'independent'
      if (!grouped[partyId]) grouped[partyId] = []
      grouped[partyId].push(c)
    })
    return grouped
  }

  const activeByParty = groupByParty(activeCouncillors)

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-normal mb-2">Zastupitelé obce</h1>
        <p className="text-black/60">Níže si můžete prohlédnout seznam všech zastupitelů obce.</p>
      </div>

      {Object.entries(activeByParty).map(([partyId, councillorList]) => {
        const party = parties?.find((p: Party) => p.id === partyId)
        return (
          <div key={partyId} className="space-y-4">
            <h2 className="text-2xl font-normal">{party?.name || 'Nezávislí'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {councillorList.map((councillor: Councillor) => (
                <Link
                  key={councillor.id}
                  to={`/councillors/${councillor.id}`}
                  className="flex gap-3 p-4 bg-white rounded-2xl border border-black/10 no-underline hover:border-black/20 transition"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xl font-semibold">
                    {councillor.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-normal text-dark truncate">{councillor.name}</h3>
                    {councillor.function && (
                      <p className="text-sm text-black/60">{councillor.function}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {inactiveCouncillors.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-normal">Neaktivní</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveCouncillors.map((councillor: Councillor) => (
              <div
                key={councillor.id}
                className="flex gap-3 p-4 bg-white rounded-2xl border border-black/10 opacity-60"
              >
                <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xl font-semibold">
                  {councillor.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-normal text-dark truncate">{councillor.name}</h3>
                  {councillor.function && (
                    <p className="text-sm text-black/60">{councillor.function}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
