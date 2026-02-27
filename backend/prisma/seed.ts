import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Vytvoř obec
  const municipality = await prisma.municipality.create({
    data: {
      name: 'Obec Lukavice',
      district: 'Pardubický kraj',
      web: 'https://www.obeclukavice.cz/',
    },
  });

  // Vytvoř strany
  const partyProLukavici = await prisma.party.create({
    data: {
      municipalityId: municipality.id,
      name: 'PRO LUKAVICI',
      color: '#3B6629',
    },
  });

  const voluntia = await prisma.party.create({
    data: {
      municipalityId: municipality.id,
      name: 'Voluntia',
      color: '#FED701',
    },
  });

  // Vytvoř zastupitele
  const councillors = await Promise.all([
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Ilona Severová',
        partyId: partyProLukavici.id,
        function: 'Starosta',
        bio: 'Dlouholetá starostka obce Lukavice a lídryně kandidátky',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Ing. Oldřích Hubálek',
        partyId: partyProLukavici.id,
        function: 'Místostarosta',
        bio: 'Inženýr a zastupitel obce',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Leopold Hotmar',
        partyId: partyProLukavici.id,
        function: 'Místostarosta',
        bio: 'Zastupitel obce',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Roman Šafář',
        partyId: partyProLukavici.id,
        function: 'Tajemník',
        bio: 'Zastupitel obce',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Jiří Čepelka',
        partyId: voluntia.id,
        bio: 'Zastupitel obce',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Antonín Vítek',
        partyId: partyProLukavici.id,
        bio: 'Člen zastupitelstva obce',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Hana Sršňová',
        partyId: partyProLukavici.id,
        bio: 'Členka zastupitelstva obce',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Josef Lehký',
        partyId: partyProLukavici.id,
        bio: 'Zastupitel obce Lukavice',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Lenka Hubálková',
        partyId: partyProLukavici.id,
        bio: 'Členka zastupitelstva obce',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'MUDr. Lenka Kristková',
        partyId: partyProLukavici.id,
        bio: 'Lékařka a členka zastupitelstva',
        active: true,
      },
    }),
    prisma.councillor.create({
      data: {
        municipalityId: municipality.id,
        name: 'Martin Dudek',
        partyId: partyProLukavici.id,
        bio: 'Člen zastupitelstva obce',
        active: true,
      },
    }),
  ]);

  // Vytvoř návrhy
  const proposals = await Promise.all([
    prisma.proposal.create({
      data: {
        municipalityId: municipality.id,
        title: 'Nový park v centru města',
        description: 'Vytvoření nového veřejného parku s dětským hřištěm a sportovním vybavením v centru Prahy. Projekt zahrnuje obnovu zeleně, instalaci moderního vybavení a vytvoření prostoru pro setkávání občanů.',
        date: new Date('2025-09-10'),
        result: 'SCHVÁLENO',
        proposerId: councillors[4].id,
      },
    }),
    prisma.proposal.create({
      data: {
        municipalityId: municipality.id,
        title: 'Rekonstrukce hlavní ulice',
        description: 'Komplexní rekonstrukce hlavní ulice včetně obnovy vozovky, chodníků a veřejného osvětlení. Projekt zahrnuje také modernizaci inženýrských sítí.',
        date: new Date('2025-08-15'),
        result: 'SCHVÁLENO',
        proposerId: councillors[4].id,
      },
    }),
    prisma.proposal.create({
      data: {
        municipalityId: municipality.id,
        title: 'Zákaz kouření na veřejných místech',
        description: 'Zavedení zákazu kouření na vybraných veřejných místech v obci, včetně parků a čekáren.',
        date: new Date('2025-07-20'),
        result: 'ZAMÍTNUTO',
        proposerId: councillors[5].id,
      },
    }),
    prisma.proposal.create({
      data: {
        municipalityId: municipality.id,
        title: 'Zvýšení daně z nemovitosti',
        description: 'Návrh na zvýšení daně z nemovitosti pro komerční objekty v souladu s novými právními předpisy.',
        date: new Date('2025-06-10'),
        result: 'SCHVÁLENO',
        proposerId: councillors[5].id,
      },
    }),
  ]);

  // Vytvoř hlasy
  await Promise.all([
    prisma.vote.create({
      data: {
        proposalId: proposals[0].id,
        councillorId: councillors[4].id,
        vote: 'PRO',
      },
    }),
    prisma.vote.create({
      data: {
        proposalId: proposals[1].id,
        councillorId: councillors[4].id,
        vote: 'PRO',
      },
    }),
    prisma.vote.create({
      data: {
        proposalId: proposals[1].id,
        councillorId: councillors[5].id,
        vote: 'PRO',
      },
    }),
    prisma.vote.create({
      data: {
        proposalId: proposals[2].id,
        councillorId: councillors[4].id,
        vote: 'PROTI',
      },
    }),
    prisma.vote.create({
      data: {
        proposalId: proposals[2].id,
        councillorId: councillors[5].id,
        vote: 'PRO',
      },
    }),
    prisma.vote.create({
      data: {
        proposalId: proposals[3].id,
        councillorId: councillors[4].id,
        vote: 'PRO',
      },
    }),
    prisma.vote.create({
      data: {
        proposalId: proposals[3].id,
        councillorId: councillors[5].id,
        vote: 'PRO',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
