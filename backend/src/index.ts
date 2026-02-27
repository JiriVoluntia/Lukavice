import express from 'express';
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
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Municipalities
app.get('/api/municipalities/:id', async (req, res) => {
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
app.get('/api/municipalities/:municipalityId/councillors', async (req, res) => {
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

app.get('/api/councillors/:id', async (req, res) => {
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
app.get('/api/municipalities/:municipalityId/parties', async (req, res) => {
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
app.get('/api/municipalities/:municipalityId/proposals', async (req, res) => {
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

app.get('/api/proposals/:id', async (req, res) => {
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

// Admin endpoints
app.post('/api/admin/councillors', async (req, res) => {
  try {
    const { municipalityId, name, partyId, function: func, bio, imageUrl, active } = req.body;
    const councillor = await prisma.councillor.create({
      data: {
        municipalityId,
        name,
        partyId,
        function: func,
        bio,
        imageUrl,
        active,
      },
    });
    res.json(councillor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create councillor' });
  }
});

app.put('/api/admin/councillors/:id', async (req, res) => {
  try {
    const { name, partyId, function: func, bio, imageUrl, active } = req.body;
    const councillor = await prisma.councillor.update({
      where: { id: req.params.id },
      data: { name, partyId, function: func, bio, imageUrl, active },
    });
    res.json(councillor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update councillor' });
  }
});

app.delete('/api/admin/councillors/:id', async (req, res) => {
  try {
    await prisma.councillor.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete councillor' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
