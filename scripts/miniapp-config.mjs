import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const raw = process.env.APP_URL;
if (!raw) { console.error('Set APP_URL to the final HTTPS origin, for example https://food.example.com'); process.exit(1); }
const origin = new URL(raw);
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('APP_URL must be an HTTPS origin with no path.');
const base = origin.origin;
const association = process.env.FARCASTER_ACCOUNT_ASSOCIATION ? JSON.parse(process.env.FARCASTER_ACCOUNT_ASSOCIATION) : null;
if (!association || !['header','payload','signature'].every(key => typeof association[key] === 'string' && association[key])) throw new Error('Set FARCASTER_ACCOUNT_ASSOCIATION to the signed JSON from Farcaster Developer Tools.');
const manifest = {
  accountAssociation: association,
  miniapp: {
    version: '1', name: 'Shore & Season', homeUrl: base,
    iconUrl: `${base}/icon.png`, splashImageUrl: `${base}/splash.png`, splashBackgroundColor: '#d9ded2',
    subtitle: 'Native foodways & recipes',
    description: 'Explore Native recipes and living foodways from Florida to the Great Lakes.',
    primaryCategory: 'education', tags: ['food','history','culture'],
    heroImageUrl: `${base}/hero.png`, ogTitle: 'Shore & Season',
    ogDescription: 'Native recipes and living foodways from Florida to the Great Lakes.', ogImageUrl: `${base}/hero.png`,
    supportsFullScreen: true
  }
};
const embed = {version:'1',imageUrl:`${base}/embed.png`,button:{title:'Explore foodways',action:{type:'launch_miniapp',name:'Shore & Season',splashImageUrl:`${base}/splash.png`,splashBackgroundColor:'#d9ded2'}}};
const file = resolve('dist/index.html');
let html = await readFile(file,'utf8');
const tag = json => JSON.stringify(json).replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('<','&lt;');
html = html.replace('</head>', `<meta property="og:title" content="Shore & Season"/><meta property="og:description" content="Native recipes and living foodways from Florida to the Great Lakes."/><meta property="og:image" content="${base}/hero.png"/><meta name="fc:miniapp" content='${tag(embed)}'/><meta name="fc:frame" content='${tag({...embed,button:{...embed.button,action:{...embed.button.action,type:'launch_frame'}}})}'/></head>`);
await writeFile(file,html);
await mkdir(resolve('dist/.well-known'),{recursive:true});
await writeFile(resolve('dist/.well-known/farcaster.json'),JSON.stringify(manifest,null,2));
console.log(`Mini App metadata and manifest written for ${base}`);
