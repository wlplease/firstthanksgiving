import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { domainManifestSchema, safeParseMiniAppEmbed } from '@farcaster/miniapp-core';

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
// Account associations are public signed domain attestations, not private keys.
// Keep the production signature available to hosted builds even though .env* is gitignored.
const defaultAssociation = {
  header: 'eyJmaWQiOjEwNTkwNzUsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhmNmY3NDk3ZGQ4ZDI1MzdiNzUyMTZFNzhEREVGREVlMURkYjhGMEI3In0',
  payload: 'eyJkb21haW4iOiJzaG9yZXNlYXNvbi52ZXJjZWwuYXBwIn0',
  signature: 'qjdcn8ABAlB+euUXXliERd8ksSpkmQeZNxtAgoOk4JIqqyrzNrb0MSwkku9ZxUs+EUjV3SYj2V8CuDxRABJk3xs=',
};
let association = null;
const associationText = env('FARCASTER_ACCOUNT_ASSOCIATION') || (env('FARCASTER_ACCOUNT_ASSOCIATION_B64') ? Buffer.from(env('FARCASTER_ACCOUNT_ASSOCIATION_B64'), 'base64').toString('utf8') : JSON.stringify(defaultAssociation));
if (associationText) {
  try { association = JSON.parse(associationText); }
  catch { throw new Error('FARCASTER_ACCOUNT_ASSOCIATION must be valid JSON from Farcaster Developer Tools.'); }
  if (!association || !['header','payload','signature'].every(key => typeof association[key] === 'string' && association[key])) throw new Error('FARCASTER_ACCOUNT_ASSOCIATION must contain the signed header, payload, and signature from Farcaster Developer Tools.');
  // Farcaster signatures are base64url encoded. The supplied signature was
  // standard base64 (+, /, =) which parses locally but fails Farcaster's
  // account-association comparison. Convert the same signed bytes losslessly.
  const signatureBase64 = association.signature.replace(/-/g, '+').replace(/_/g, '/');
  const signatureBytes = Buffer.from(signatureBase64, 'base64');
  if (!signatureBytes.length || signatureBytes.toString('base64').replace(/=+$/, '') !== signatureBase64.replace(/=+$/, '')) {
    throw new Error('The Farcaster account-association signature is not valid base64/base64url. Copy the signature from Farcaster Developer Tools.');
  }
  association.signature = signatureBytes.toString('base64url');
  let associationDomain = '';
  try { associationDomain = JSON.parse(Buffer.from(association.payload, 'base64url').toString('utf8')).domain || ''; }
  catch { throw new Error('The Farcaster account association payload could not be decoded. Generate a fresh signed association for the production domain.'); }
  if (associationDomain !== origin.hostname) throw new Error(`The signed account association is for ${associationDomain}, but APP_URL resolves to ${origin.hostname}. Generate a new association for that domain.`);
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
    supportsFullScreen: true, castShareUrl: base
  }
};
if (association) manifest.accountAssociation = association;
const embed = {version:'1',imageUrl:`${base}/embed.png`,aspectRatio:'3:2',button:{title:'Explore foodways',action:{type:'launch_miniapp',name:'Shore & Season',url:base,splashImageUrl:`${base}/splash.png`,splashBackgroundColor:'#d9ded2'}}};
const manifestResult = domainManifestSchema.safeParse(manifest);
if (!manifestResult.success) throw new Error(`Invalid Farcaster domain manifest:\n${manifestResult.error.message}`);
const embedResult = safeParseMiniAppEmbed(embed);
if (!embedResult.success) throw new Error(`Invalid Farcaster Mini App share embed:\n${embedResult.error.message}`);
const pngDimensions = async path => {
  const bytes = await readFile(resolve(path));
  if (bytes.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error(`${path} is not a valid PNG.`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), colorType: bytes[25] };
};
const expectedImages = [
  ['public/icon.png', 1024, 1024], ['public/splash.png', 200, 200],
  ['public/hero.png', 1200, 630], ['public/embed.png', 1200, 800],
];
for (const [path, width, height] of expectedImages) {
  const actual = await pngDimensions(path);
  if (actual.width !== width || actual.height !== height) throw new Error(`${path} must be ${width}x${height}; found ${actual.width}x${actual.height}.`);
  if (actual.colorType === 6) throw new Error(`${path} must not contain an alpha channel; Farcaster Mini App artwork should be opaque.`);
}
const file = resolve('dist/index.html');
let html = await readFile(file,'utf8');
const tag = json => JSON.stringify(json).replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('<','&lt;');
html = html.replace(/<meta\s+(?:(?:property="og:[^"]+")|(?:name="twitter:[^"]+"))[^>]*\/?\s*>/g,'');
const socialMeta = `<meta property="og:type" content="website"/><meta property="og:site_name" content="Shore &amp; Season"/><meta property="og:title" content="Shore &amp; Season · Native recipes and foodways"/><meta property="og:description" content="Explore Native recipes and living foodways from Florida to the Great Lakes."/><meta property="og:url" content="${base}/"/><meta property="og:image" content="${base}/hero.png"/><meta property="og:image:alt" content="Illustrated coastal marsh at golden hour for Shore &amp; Season"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="Shore &amp; Season · Native recipes and foodways"/><meta name="twitter:description" content="Explore Native recipes and living foodways from Florida to the Great Lakes."/><meta name="twitter:image" content="${base}/hero.png"/>`;
html = html.replace('</head>', `${socialMeta}<meta name="fc:miniapp" content='${tag(embed)}'/></head>`);
await writeFile(file,html);
await mkdir(resolve('dist/.well-known'),{recursive:true});
await writeFile(resolve('dist/.well-known/farcaster.json'),JSON.stringify(manifest,null,2));
console.log(`Farcaster Mini App manifest, share embed, and artwork validated for ${base}`);
