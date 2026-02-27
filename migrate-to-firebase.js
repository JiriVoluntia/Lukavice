// Script pro migraci dat z JSONů do Firebase
// Spusť: node migrate-to-firebase.js

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const FIREBASE_DB = 'https://lukavice-288a6-default-rtdb.europe-west1.firebasedatabase.app';

async function migrateData() {
  try {
    console.log('Zahájení migrace dat do Firebase...');

    // 1. Migrace zastupitelů
    console.log('Migrace zastupitelů...');
    const councillorsDir = './data/zastupitele';
    const councillors = {};
    
    fs.readdirSync(councillorsDir).forEach(file => {
      if (file.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(path.join(councillorsDir, file), 'utf-8'));
        councillors[data.id] = data;
      }
    });
    
    await fetch(`${FIREBASE_DB}/councillors.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(councillors)
    });
    console.log('✓ Zastupitelé migráni');

    // 2. Migrace stran
    console.log('Migrace stran...');
    const partiesDir = './data/strany';
    const parties = {};
    
    fs.readdirSync(partiesDir).forEach(file => {
      if (file.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(path.join(partiesDir, file), 'utf-8'));
        parties[data.id] = data;
      }
    });
    
    await fetch(`${FIREBASE_DB}/parties.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parties)
    });
    console.log('✓ Strany migráni');

    // 3. Migrace návrhů
    console.log('Migrace návrhů...');
    const proposalsDir = './data/navrhy';
    const proposals = {};
    
    fs.readdirSync(proposalsDir).forEach(file => {
      if (file.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(path.join(proposalsDir, file), 'utf-8'));
        proposals[data.id] = data;
      }
    });
    
    await fetch(`${FIREBASE_DB}/proposals.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposals)
    });
    console.log('✓ Návrhy migráni');

    // 4. Migrace obecních informací
    console.log('Migrace obecních informací...');
    const generalInfo = JSON.parse(fs.readFileSync('./data/obecne-info.json', 'utf-8'));
    
    await fetch(`${FIREBASE_DB}/settings/info.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generalInfo.info)
    });
    
    await fetch(`${FIREBASE_DB}/settings/functions.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generalInfo.funkce)
    });
    console.log('✓ Obecní informace migráni');

    console.log('\n✓ Migrace dokončena!');
  } catch (error) {
    console.error('Chyba při migraci:', error);
  }
}

migrateData();
