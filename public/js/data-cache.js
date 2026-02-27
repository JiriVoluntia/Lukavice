// Cache pro data s TTL (time to live)
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hodin

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
    const fileList = await fetch('/api/list?dir=data/zastupitele').then(r => r.json());
    
    for (const fileName of fileList) {
      try {
        const res = await fetch(`data/zastupitele/${fileName}.json`);
        const data = await res.json();
        councillors[data.id] = data;
      } catch (e) {
        console.warn(`Chyba při načítání ${fileName}`);
      }
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
    const fileList = await fetch('/api/list?dir=data/strany').then(r => r.json());
    
    for (const fileName of fileList) {
      try {
        const res = await fetch(`data/strany/${fileName}.json`);
        const data = await res.json();
        parties[data.id] = data;
      } catch (e) {
        console.warn(`Chyba při načítání strany ${fileName}`);
      }
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
    const res = await fetch('data/obecne-info.json');
    const data = await res.json();
    const functions = data.funkce || [];
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
    const fileList = await fetch('/api/list?dir=data/navrhy').then(r => r.json());
    console.log('File list from API:', fileList);
    
    for (const fileName of fileList) {
      try {
        const res = await fetch(`data/navrhy/${fileName}.json`);
        const data = await res.json();
        console.log(`Loaded proposal ${fileName}:`, data);
        proposals.push(data);
      } catch (e) {
        console.error(`Chyba při načítání návrhu ${fileName}:`, e);
      }
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
    const res = await fetch('data/obecne-info.json');
    const data = await res.json();
    cache.setCache('general_info', data);
    return data;
  } catch (error) {
    console.error('Chyba při načítání obecních informací:', error);
    return {};
  }
}
