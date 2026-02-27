export interface Municipality {
  id: string
  name: string
  district: string
  web?: string
  logoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Party {
  id: string
  municipalityId: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface Councillor {
  id: string
  municipalityId: string
  name: string
  partyId?: string
  party?: Party
  function?: string
  bio?: string
  imageUrl?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Vote {
  id: string
  proposalId: string
  councillorId: string
  councillor?: Councillor
  vote: 'PRO' | 'PROTI' | 'ABSTAIN'
  createdAt: string
  updatedAt: string
}

export interface Proposal {
  id: string
  municipalityId: string
  title: string
  description: string
  date: string
  result: 'SCHVÁLENO' | 'ZAMÍTNUTO' | 'PENDING'
  proposerId?: string
  votes?: Vote[]
  createdAt: string
  updatedAt: string
}
