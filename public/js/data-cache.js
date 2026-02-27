// Cache pro data s TTL (time to live)
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hodin
const FIREBASE_DB = 'https://lukavice-288a6-default-rtdb.europe-west1.firebasedatabase.app';

class DataCache {
  constructor() {
    this.prefix = 'lukavice_cache_';
  }

  getCacheKey(type) {
    return this.prefix + type;
  }

  getTimestampKey(type) {
    return this.prefix + type + '_timestamp';
  }

  isCacheValid(type) {
    const timestamp = localStorage.getItem(this.getTimestampKey(type));
    if (!timestamp) return false;
    return Date.now() - parseInt(timestamp) < CACHE_TTL;
  }

  setCache(type, data) {
    localStorage.setItem(this.getCacheKey(type), JSON.stringify(data));
    localStorage.setItem(this.getTimestampKey(type), Date.now().toString());
  }

  getCache(type) {
    if (!this.isCacheValid(type)) return null;
    const cached = localStorage.getItem(this.getCacheKey(type));
    return cached ? JSON.parse(cached) : null;
  }

  clearCache(type) {
    localStorage.removeItem(this.getCacheKey(type));
    localStorage.removeItem(this.getTimestampKey(type));
  }
}

const cache = new DataCache();

// Dynamické načtení zastupitelů s cachováním
async function loadCouncillors() {
  const cached = cache.getCache('councillors');
  if (cached) return cached;

  const councillors = {};
  try {
    const res = await fetch(`${FIREBASE_DB}/councillors.json`);
    const data = await res.json();
    
    if (data) {
      Object.keys(data).forEach(key => {
        councillors[data[key].id] = data[key];
      });
    }
  } catch (error) {
    console.error('Chyba při načítání zastupitelů:', error);
  }
  
  cache.setCache('councillors', councillors);
  return councillors;
}

// Dynamické načtení stran s cachováním
async function loadParties() {
  const cached = cache.getCache('parties');
  if (cached) return cached;

  const parties = {};
  try {
    const res = await fetch(`${FIREBASE_DB}/parties.json`);
    const data = await res.json();
    
    if (data) {
      Object.keys(data).forEach(key => {
        parties[data[key].id] = data[key];
      });
    }
  } catch (error) {
    console.error('Chyba při načítání stran:', error);
  }
  
  cache.setCache('parties', parties);
  return parties;
}

// Načtení funkcí s cachováním
async function loadFunctions() {
  const cached = cache.getCache('functions');
  if (cached) return cached;

  try {
    const res = await fetch(`${FIREBASE_DB}/settings/functions.json`);
    const data = await res.json();
    const functions = data || [];
    cache.setCache('functions', functions);
    return functions;
  } catch (error) {
    console.error('Chyba při načítání funkcí:', error);
    return [];
  }
}

// Dynamické načtení návrhů s cachováním
async function loadProposals() {
  const cached = cache.getCache('proposals');
  if (cached) {
    console.log('Proposals loaded from cache:', cached);
    return cached;
  }

  const proposals = [];
  try {
    const res = await fetch(`${FIREBASE_DB}/proposals.json`);
    const data = await res.json();
    
    if (data) {
      Object.keys(data).forEach(key => {
        proposals.push(data[key]);
      });
    }
  } catch (error) {
    console.error('Chyba při načítání návrhů:', error);
  }
  
  console.log('All proposals loaded:', proposals);
  cache.setCache('proposals', proposals);
  return proposals;
}

// Načtení obecních informací s cachováním
async function loadGeneralInfo() {
  const cached = cache.getCache('general_info');
  if (cached) return cached;

  try {
    const res = await fetch(`${FIREBASE_DB}/settings/info.json`);
    const data = await res.json();
    cache.setCache('general_info', { info: data });
    return { info: data };
  } catch (error) {
    console.error('Chyba při načítání obecních informací:', error);
    return { info: {} };
  }
}
