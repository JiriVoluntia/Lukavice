export default function handler(req, res) {
  const { dir } = req.query;
  
  if (!dir) {
    return res.status(400).json({ error: 'Missing dir parameter' });
  }
  
  // Vrátíme seznam souborů z adresáře
  // Vercel má přístup k public/ adresáři
  const lists = {
    'data/zastupitele': ['antonin-vitek', 'hana-srsnnova', 'ilona-severova', 'jiri-cepelka', 'josef-lehky', 'lenka-hubalkova', 'lenka-kristkova', 'leopold-hotmar', 'martin-dudek', 'oldrich-hubalek', 'roman-safar'],
    'data/strany': ['party-pro-lukavici', 'voluntia'],
    'data/navrhy': ['novy-park-v-centru-mesta', 'rekonstrukce-hlavni-ulice', 'zakaz-koureni-na-verejnych-mistech', 'zvyseni-dane-z-nemovitosti']
  };
  
  if (lists[dir]) {
    res.status(200).json(lists[dir]);
  } else {
    res.status(404).json({ error: 'Directory not found' });
  }
}
