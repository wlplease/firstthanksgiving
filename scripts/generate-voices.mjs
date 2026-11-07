import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Generated audio is checked into public/audio; credentials are read only from
// an ignored local env file and are never copied into the browser bundle.
const envFile = resolve('.env.local');
const envText = await readFile(envFile, 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter(Boolean).map(line => {
  const index = line.indexOf('=');
  return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')];
}));
const apiKey = env.ELEVELN_LAB_API_KEY || env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error('Add ELEVELN_LAB_API_KEY to the ignored .env.local file.');

// Use a standard narrator voice, with no attempt to imitate a Native speaker,
// community, accent, or ceremonial vocal style.
const voiceId = process.env.ELEVENLABS_VOICE_ID || env.ELEVENLABS_VOICE_ID;
if (!voiceId) throw new Error('Add your own ElevenLabs voice ID as ELEVENLABS_VOICE_ID in .env.local. Library voices are not available through this account API plan.');
const clips = [
  { file: 'first-table-welcome.mp3', text: 'Welcome to First Table. Explore recipes, ingredients, and food stories from Florida north through the Atlantic coast and Great Lakes. Each place holds distinct traditions, and each story points to its source. Choose a region, find a dish, and bring a little more of its context to your table.' },
  { file: 'st-augustine-1565.mp3', text: 'In September 1565, Pedro Menéndez and the Spanish colonists held a Mass of thanksgiving at St. Augustine, in Timucua homeland. The exact menu is unknown. The Florida Museum documents Timucua fishing, hunting, and cultivation of corn, beans, and squash. This is the local setting behind the story, not a claim that a modern recipe recreates that meal.' },
  { file: 'oneida-wild-rice-stuffing.mp3', text: 'This wild rice stuffing comes from an Oneida community cookbook and is credited to an anonymous Oneida elder. Wild rice and white rice meet apple, mushrooms, sage, and seasoned croutons. It is one community recipe, shared in print, not a single recipe for all Great Lakes peoples.' },
  { file: 'timucua-smoked-fish-pot.mp3', text: 'This smoked fish, corn, and squash pot is a new First Table home recipe inspired by foods documented for Timucua communities near St. Augustine. The museum describes fishing and the preservation of fish by smoking, alongside cultivated corn, beans, and squash. It is a modern interpretation, not a recovered Timucua recipe.' }
];

const output = resolve('public/audio');
await mkdir(output, { recursive: true });
for (const clip of clips) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text: clip.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.58, similarity_boost: 0.78, style: 0.12, use_speaker_boost: true }
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Speech generation failed for ${clip.file} (${response.status}): ${detail}`);
  }
  await writeFile(resolve(output, clip.file), Buffer.from(await response.arrayBuffer()));
  console.log(`Generated ${clip.file}`);
}
