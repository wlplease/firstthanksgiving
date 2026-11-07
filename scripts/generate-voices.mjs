import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Credentials stay in ignored .env.local. Generated same-origin audio means
// the browser never needs the ElevenLabs key or a third-party audio request.
const envText = await readFile(resolve('.env.local'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter(Boolean).map(line => {
  const index = line.indexOf('=');
  return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')];
}));
const apiKey = env.ELEVELN_LAB_API_KEY || env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error('Add ELEVELN_LAB_API_KEY to the ignored .env.local file.');

const femaleVoice = process.env.ELEVENLABS_VOICE_ID_FEMALE || env.ELEVENLABS_VOICE_ID_FEMALE;
const maleVoice = process.env.ELEVENLABS_VOICE_ID_MALE || env.ELEVENLABS_VOICE_ID_MALE;
if (!femaleVoice || !maleVoice) {
  throw new Error('Set ELEVENLABS_VOICE_ID_FEMALE and ELEVENLABS_VOICE_ID_MALE in .env.local.');
}

const turn = (voice_id, text) => ({ voice_id, text });
const clips = [
  {
    file: 'all-coasts-intro.mp3',
    inputs: [
      turn(femaleVoice, '[warm, welcoming] Welcome to All coasts. This is a foodways field walk from Florida to the Great Lakes.'),
      turn(maleVoice, '[curious, reflective] Follow five shorelines through ingredients, places, and stories shared by distinct Native communities.'),
      turn(femaleVoice, '[gentle, inviting] Choose a food thread to open its region, or follow the short trail to the table.'),
      turn(maleVoice, '[thoughtful] No scores, no single story. Just a place to begin, and more to discover.')
    ]
  },
  {
    file: 'pantry-guide.mp3',
    inputs: [
      turn(femaleVoice, '[warm, thoughtful] Welcome to the pantry field guide. These ingredients connect to specific places and sources, not one universal Native pantry.'),
      turn(maleVoice, '[calm, informative] Follow each note back to its publisher. Some plants require specialist knowledge and careful processing.'),
      turn(femaleVoice, '[clear, caring] Do not forage from this guide; choose safe, cultivated, legally sourced ingredients.')
    ]
  },
  {
    file: 'feast-guide.mp3',
    inputs: [
      turn(femaleVoice, '[warm, welcoming] Welcome to the feast table. Start with a place and choose a meal guide, or bring in recipes you have already explored.'),
      turn(maleVoice, '[clear, helpful] Adjust servings to shape the list. Each dish keeps its source and recipe status close by.'),
      turn(femaleVoice, '[gentle, inviting] Gather the ingredients you need, then share the menu with your people.')
    ]
  },
  {
    file: 'shore-season-welcome.mp3',
    inputs: [
      turn(femaleVoice, '[warm, welcoming] Welcome to Shore and Season, a journey from Florida along the Atlantic coast and toward the Great Lakes.'),
      turn(maleVoice, '[calm, thoughtful] We follow recipes, ingredients, and stories rooted in specific places.'),
      turn(femaleVoice, '[gentle] Each community carries its own food traditions.'),
      turn(maleVoice, '[inviting] Choose a region, find a dish, and follow its sources.')
    ]
  },
  {
    file: 'foodways-field-walk.mp3',
    inputs: [
      turn(femaleVoice, '[warm, inviting] Welcome to the foodways field walk. Every trail begins with a place.'),
      turn(maleVoice, '[calm, curious] Follow the shore, the river, and the foods people grow, gather, fish, and prepare.'),
      turn(femaleVoice, '[thoughtful] Each food thread leads to a named community, its source, and a living story.'),
      turn(maleVoice, '[gentle, encouraging] Choose an ingredient. Follow its story. Then bring what you learn to your own table.')
    ]
  },
  {
    file: 'field-notes-florida.mp3',
    inputs: [
      turn(femaleVoice, '[warm, thoughtful] Begin in Florida, where Seminole sources describe sofkee, pumpkin gardens, citrus, and foods shaped by this peninsula.'),
      turn(maleVoice, '[calm, measured] On the First Coast, Timucua history around Seloy connects cultivated fields with river and coastal foods.'),
      turn(femaleVoice, '[respectful] These are distinct peoples and living histories. The exact menu of the 1565 meal is unknown.'),
      turn(maleVoice, '[inviting] Choose one food thread, then follow it to the source.')
    ]
  },
  {
    file: 'field-notes-southeast.mp3',
    inputs: [
      turn(femaleVoice, '[warm, clear] In western North Carolina, Eastern Band of Cherokee Indians foodways and Tribal Foods share contemporary recipes.'),
      turn(maleVoice, '[thoughtful] Muscogee community food traditions belong to another distinct place and people.'),
      turn(femaleVoice, '[measured] Three Sisters foods appear across many communities; there is no single universal recipe.'),
      turn(maleVoice, '[gentle] Open each story with its own source and context.')
    ]
  },
  {
    file: 'field-notes-midatlantic.mp3',
    inputs: [
      turn(femaleVoice, '[warm, reflective] Follow the Chesapeake waters and Tidewater rivers through a region of distinct Native homelands.'),
      turn(maleVoice, '[clear] Nanticoke and Powhatan stories each carry their own community and place.'),
      turn(femaleVoice, '[respectful] A source may describe foods without preserving a recipe; modern adaptations are labeled as new ideas.'),
      turn(maleVoice, '[inviting] Choose a river or garden food, then follow the story back to its publisher.')
    ]
  },
  {
    file: 'field-notes-northeast.mp3',
    inputs: [
      turn(femaleVoice, '[warm, thoughtful] From Sipayik in Maine to Southern New England, every shoreline holds distinct Native communities and food knowledge.'),
      turn(maleVoice, '[calm] Wampanoag, Mohegan, Narragansett, and Passamaquoddy sources speak from their own places.'),
      turn(femaleVoice, '[gentle] Community recipes and historical food descriptions each tell us something different.'),
      turn(maleVoice, '[inviting] Follow one ingredient to its source, then see how it enters today’s kitchen.')
    ]
  },
  {
    file: 'field-notes-greatlakes.mp3',
    inputs: [
      turn(femaleVoice, '[warm, clear] In Wisconsin homelands, Oneida Nation sources share local corn, wild rice, and seasonal foods.'),
      turn(maleVoice, '[thoughtful] Brothertown recipes and regional collections are labeled separately, each with its own source.'),
      turn(femaleVoice, '[respectful] This trail is not one menu for all Great Lakes peoples.'),
      turn(maleVoice, '[inviting] Let a recipe lead you back to the community that shared it.')
    ]
  },
  {
    file: 'st-augustine-1565.mp3',
    inputs: [
      turn(femaleVoice, '[measured, reflective] In September 1565, Spanish colonists held a Mass of thanksgiving at St. Augustine, in Timucua homeland.'),
      turn(maleVoice, '[clear] The exact menu is unknown.'),
      turn(femaleVoice, '[warm, informative] Museum records describe Timucua fishing, hunting, and the cultivation of corn, beans, and squash.'),
      turn(maleVoice, '[respectful] This helps us understand the place. It does not reconstruct that meal or speak for Seloy people today.')
    ]
  },
  {
    file: 'oneida-wild-rice-stuffing.mp3',
    inputs: [
      turn(femaleVoice, '[warm, informative] This wild rice stuffing comes from an Oneida community cookbook and is credited to an anonymous Oneida elder.'),
      turn(maleVoice, '[easy, conversational] Wild rice and white rice meet apple, mushrooms, sage, and seasoned croutons.'),
      turn(femaleVoice, '[gentle] It is one community recipe, shared in print.'),
      turn(maleVoice, '[thoughtful] Not one recipe for all Great Lakes peoples.')
    ]
  },
  {
    file: 'timucua-smoked-fish-pot.mp3',
    inputs: [
      turn(femaleVoice, '[warm, clear] This smoked fish, corn, and squash pot is a new Shore and Season home recipe.'),
      turn(maleVoice, '[measured] It draws inspiration from foods documented for Timucua communities near St. Augustine.'),
      turn(femaleVoice, '[informative] The Florida Museum describes fishing, smoked fish, and cultivated corn, beans, and squash.'),
      turn(maleVoice, '[respectful] A modern interpretation, not a recovered Timucua recipe.')
    ]
  }
];

const output = resolve('public/audio');
await mkdir(output, { recursive: true });
const requestedFiles = process.argv.slice(2);
const clipsToGenerate = requestedFiles.length ? clips.filter(clip => requestedFiles.includes(clip.file)) : clips;
const missingFiles = requestedFiles.filter(file => !clips.some(clip => clip.file === file));
if (missingFiles.length) throw new Error(`No voice clip configured for ${missingFiles.join(', ')}.`);
if (!clipsToGenerate.length) throw new Error('No voice clips were selected.');
for (const clip of clipsToGenerate) {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-dialogue?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      model_id: 'eleven_v3',
      language_code: 'en',
      inputs: clip.inputs,
      apply_text_normalization: 'on',
      seed: 4171565
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Dialogue generation failed for ${clip.file} (${response.status}): ${detail}`);
  }
  await writeFile(resolve(output, clip.file), Buffer.from(await response.arrayBuffer()));
  console.log(`Generated two-voice dialogue: ${clip.file}`);
}
