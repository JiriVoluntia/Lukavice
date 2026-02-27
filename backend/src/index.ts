import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Municipalities
app.get('/api/municipalities/:id', async (req: Request, res: Response) => {
  try {
    const municipality = await prisma.municipality.findUnique({
      where: { id: req.params.id },
      include: {
        parties: true,
        councillors: { include: { party: true } },
        proposals: { include: { votes: true } },
      },
    });
    res.json(municipality);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch municipality' });
  }
});

// Councillors
app.get('/api/municipalities/:municipalityId/councillors', async (req: Request, res: Response) => {
  try {
    const councillors = await prisma.councillor.findMany({
      where: { municipalityId: req.params.municipalityId },
      include: { party: true },
    });
    res.json(councillors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch councillors' });
  }
});

app.get('/api/councillors/:id', async (req: Request, res: Response) => {
  try {
    const councillor = await prisma.councillor.findUnique({
      where: { id: req.params.id },
      include: { party: true, votes: { include: { proposal: true } } },
    });
    res.json(councillor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch councillor' });
  }
});

// Parties
app.get('/api/municipalities/:municipalityId/parties', async (req: Request, res: Response) => {
  try {
    const parties = await prisma.party.findMany({
      where: { municipalityId: req.params.municipalityId },
    });
    res.json(parties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parties' });
  }
});

// Proposals
app.get('/api/municipalities/:municipalityId/proposals', async (req: Request, res: Response) => {
  try {
    const proposals = await prisma.proposal.findMany({
      where: { municipalityId: req.params.municipalityId },
      include: { votes: { include: { councillor: true } } },
      orderBy: { date: 'desc' },
    });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

app.get('/api/proposals/:id', async (req: Request, res: Response) => {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.id },
      include: { votes: { include: { councillor: true } } },
    });
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});
