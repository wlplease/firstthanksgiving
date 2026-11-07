# Shore & Season narration

Shore & Season uses short, optional two-speaker readings: a female narrator and a male narrator take turns. The selected voices are Bella (American, informative) and Roger (American, warm and resonant). The voices are standard ElevenLabs voices, not imitations of Native speakers, accents, ceremonial styles, or community voices.

The generated MP3s live in `public/audio/`, so visitors receive same-origin files and the app never exposes the ElevenLabs key. If a clip is unavailable, Listen falls back to the device's speech synthesis when available.

## Generate or replace the MP3s

Keep these values in the ignored `.env.local` file:

```text
ELEVELN_LAB_API_KEY=your_api_key
ELEVENLABS_VOICE_ID_FEMALE=your_female_voice_id
ELEVENLABS_VOICE_ID_MALE=your_male_voice_id
```

The API key must allow Text to Dialogue, and both voices must be available to the account. Never add `.env.local` to Git or expose the key through a `VITE_` variable.

Run `npm run audio:generate` to write the four local clips for the welcome, St. Augustine 1565 context, Oneida wild rice stuffing, and Timucua-inspired smoked fish pot. The generator uses ElevenLabs Text to Dialogue, Eleven v3, and MP3 44.1 kHz output.

## Editorial audio notes

- Audio is opt-in; nothing plays automatically.
- The St. Augustine narration says the exact menu is unknown.
- The Oneida wild rice stuffing is identified as an elder-attributed cookbook recipe.
- The smoked-fish pot is identified as a new Shore & Season recipe, not a recovered Timucua dish.
- Review pronunciation and every generated clip before release.
