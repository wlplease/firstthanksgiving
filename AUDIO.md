# First Table narration

First Table has short, optional narrator moments in the hero and selected story cards. The narration is original editorial copy. It uses a neutral narrator voice and does not imitate Native speakers, accents, ceremonial styles, or community voices.

Generated MP3s belong in `public/audio/`; visitors receive these same-origin files, and the app never exposes the ElevenLabs API key. If a local MP3 has not been generated or cannot play, the Listen control falls back to the device browser's speech synthesis when available.

## Generate or replace the MP3s

The ignored `.env.local` file may contain:

```text
ELEVELN_LAB_API_KEY=your_api_key
ELEVENLABS_VOICE_ID=your_owned_voice_id
```

The API key needs text-to-speech permission, and the selected voice must be available for API use on the account. A built-in library voice may require a paid plan. Do not add `.env.local` to Git or expose the key through a `VITE_` variable.

Run `npm run audio:generate` to write the four local audio clips. The clips are intentionally short and are mapped in `src/main.js` to the welcome, St. Augustine 1565 context, Oneida wild rice stuffing, and Timucua-inspired smoked fish pot.

## Editorial audio notes

- Audio is opt-in; nothing plays automatically.
- The St. Augustine narration says the exact menu is unknown.
- The Oneida wild rice stuffing is identified as an elder-attributed cookbook recipe.
- The smoked-fish pot is identified as a new First Table recipe, not a recovered Timucua dish.
- Keep voice/model settings modest and consistent; review pronunciation and every generated clip before release.
