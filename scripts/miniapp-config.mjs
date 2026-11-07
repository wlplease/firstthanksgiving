import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const localEnv = {};
try {
  const contents = await readFile(resolve('.env.local'), 'utf8');
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) localEnv[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, '$2');
  }
} catch {}
const env = key => process.env[key] || localEnv[key];
const raw = env('APP_URL') || (env('VERCEL_PROJECT_PRODUCTION_URL') ? `https://${env('VERCEL_PROJECT_PRODUCTION_URL')}` : 'https://shoreseason.vercel.app');
const origin = new URL(raw);
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('APP_URL must be an HTTPS origin with no path.');
const base = origin.origin;
let association = null;
const associationText = env('FARCASTER_ACCOUNT_ASSOCIATION') || (env('FARCASTER_ACCOUNT_ASSOCIATION_B64') ? Buffer.from(env('FARCASTER_ACCOUNT_ASSOCIATION_B64'), 'base64').toString('utf8') : '');
if (associationText) {
  try { association = JSON.parse(associationText); }
  catch { throw new Error('FARCASTER_ACCOUNT_ASSOCIATION must be valid JSON from Farcaster Developer Tools.'); }
  if (!association || !['header','payload','signature'].every(key => typeof association[key] === 'string' && association[key])) throw new Error('FARCASTER_ACCOUNT_ASSOCIATION must contain the signed header, payload, and signature from Farcaster Developer Tools.');
}
const manifest = {
  miniapp: {
    version: '1', name: 'Shore & Season', homeUrl: base,
    iconUrl: `${base}/icon.png`, splashImageUrl: `${base}/splash.png`, splashBackgroundColor: '#d9ded2',
    subtitle: 'Native foodways and recipes',
    description: 'Explore Native recipes and living foodways from Florida to the Great Lakes.',
    primaryCategory: 'education', tags: ['food','history','culture'],
    heroImageUrl: `${base}/hero.png`, ogTitle: 'Shore and Season',
    ogDescription: 'Native recipes and living foodways from Florida to the Great Lakes.', ogImageUrl: `${base}/hero.png`,
    supportsFullScreen: true
  }
};
if (association) manifest.accountAssociation = association;
const embed = {version:'1',imageUrl:`${base}/embed.png`,button:{title:'Explore foodways',action:{type:'launch_miniapp',name:'Shore & Season',splashImageUrl:`${base}/splash.png`,splashBackgroundColor:'#d9ded2'}}};
const file = resolve('dist/index.html');
let html = await readFile(file,'utf8');
const tag = json => JSON.stringify(json).replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('<','&lt;');
html = html.replace('</head>', `<meta property="og:type" content="website"/><meta property="og:site_name" content="Shore & Season"/><meta property="og:title" content="Shore & Season"/><meta property="og:description" content="Native recipes and living foodways from Florida to the Great Lakes."/><meta property="og:image" content="${base}/hero.png"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="Shore & Season"/><meta name="twitter:description" content="Native recipes and living foodways from Florida to the Great Lakes."/><meta name="twitter:image" content="${base}/hero.png"/><meta name="fc:miniapp" content='${tag(embed)}'/></head>`);
await writeFile(file,html);
await mkdir(resolve('dist/.well-known'),{recursive:true});
await writeFile(resolve('dist/.well-known/farcaster.json'),JSON.stringify(manifest,null,2));
console.log(`Mini App metadata and manifest written for ${base}`);
