// Dynamické načtení zastupitelů
async function loadCouncillors() {
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
  return councillors;
}

// Dynamické načtení stran
async function loadParties() {
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
  return parties;
}

// Načtení funkcí
async function loadFunctions() {
  try {
    const res = await fetch('data/obecne-info.json');
    const data = await res.json();
    return data.funkce || [];
  } catch (error) {
    console.error('Chyba při načítání funkcí:', error);
    return [];
  }
}

// Vytvoření HTML pro avatar
function createAvatarHTML(councillor) {
  const profileImage = councillor.profilovyObrazek;
  const initials = councillor.jmeno.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  
  if (profileImage) {
    return `<div class="councillor-avatar">
      <img src="${profileImage}" alt="${councillor.jmeno}">
    </div>`;
  } else {
    return `<div class="councillor-avatar">
      <div class="councillor-avatar-placeholder">${initials}</div>
    </div>`;
  }
}

// Inicializace
async function init() {
  const councillors = await loadCouncillors();
  const parties = await loadParties();
  const functions = await loadFunctions();
  
  // Vytvoření mapy funkcí
  const functionMap = {};
  functions.forEach(func => {
    functionMap[func.zastupitel] = func.nazev;
  });
  
  // Počítání zastupitelů podle stran
  const partyCounts = {};
  Object.values(councillors).forEach(councillor => {
    if (councillor.aktivni) {
      const partyId = councillor.strana || 'independent';
      partyCounts[partyId] = (partyCounts[partyId] || 0) + 1;
    }
  });
  
  // Vytvoření složení zastupitelstva - pouze strany s aktivními členy
  const compositionItems = Object.entries(parties)
    .filter(([partyId]) => (partyCounts[partyId] || 0) > 0)
    .map(([partyId, party]) => {
      const count = partyCounts[partyId];
      
      return `
        <div class="composition-item">
          <div style="display: flex; align-items: center; gap: 5px;">
            <span class="composition-label">${party.nazev}</span>
            <span class="composition-count" style="color: ${party.barva}">${count}</span>
          </div>
        </div>
      `;
    })
    .join('');
  
  // Vytvoření všech koleček dohromady - seskupená podle stran (pouze aktivní strany)
  const allCircles = [];
  Object.entries(parties).forEach(([partyId, party]) => {
    const count = partyCounts[partyId] || 0;
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        allCircles.push(`<div class="composition-circle" style="background-color: ${party.barva}"></div>`);
      }
    }
  });
  
  // Výpočet počtu sloupců (min 2, max 5 řádků)
  const totalCouncillors = allCircles.length;
  let rows = 2;
  
  if (totalCouncillors > 10) rows = 3;
  if (totalCouncillors > 25) rows = 4;
  if (totalCouncillors > 40) rows = 5;
  
  const visualizationDiv = document.createElement('div');
  visualizationDiv.className = 'composition-visualization';
  visualizationDiv.style.gridTemplateRows = `repeat(${rows}, 40px)`;
  visualizationDiv.innerHTML = allCircles.join('');
  
  document.getElementById('compositionSection').innerHTML = `
    <div class="composition-header">
      ${compositionItems}
    </div>
  `;
  document.getElementById('compositionSection').appendChild(visualizationDiv);
  
  // Seskupení zastupitelů podle stran
  const councillorsByParty = {};
  Object.values(councillors).forEach(councillor => {
    console.log(`${councillor.jmeno}: aktivni=${councillor.aktivni} (type: ${typeof councillor.aktivni})`);
    if (councillor.aktivni === true) {
      const partyId = councillor.strana;
      if (!councillorsByParty[partyId]) {
        councillorsByParty[partyId] = [];
      }
      councillorsByParty[partyId].push(councillor);
    }
  });
  console.log('councillorsByParty:', councillorsByParty);
  console.log('Všichni zastupitelé:', Object.values(councillors).map(c => ({ jmeno: c.jmeno, aktivni: c.aktivni })));
  
  // Vytvoření HTML pro zastupitele - pouze strany s aktivními členy
  const councillorsHTML = Object.entries(parties)
    .filter(([partyId]) => (councillorsByParty[partyId] || []).length > 0)
    .map(([partyId, party]) => {
      const partyCouncillors = councillorsByParty[partyId];
      
      const councillorsCards = partyCouncillors
        .map(councillor => {
          const func = functionMap[councillor.id];
          const funcHTML = func ? `<p class="councillor-function">${func}</p>` : '';
          
          return `
            <a href="councillor.html?id=${councillor.id}" style="text-decoration: none; color: inherit;">
              <div class="councillor-card">
                ${createAvatarHTML(councillor)}
                <div class="councillor-info">
                  <p class="councillor-name">${councillor.jmeno}</p>
                  ${funcHTML}
                </div>
              </div>
            </a>
          `;
        })
        .join('');
      
      return `
        <div class="party-group">
          <h2 class="party-name">${party.nazev}</h2>
          <div class="councillors-list">
            ${councillorsCards}
          </div>
        </div>
      `;
    })
    .join('');
  
  document.getElementById('councillorsSection').innerHTML = councillorsHTML;
}

document.addEventListener('DOMContentLoaded', init);
