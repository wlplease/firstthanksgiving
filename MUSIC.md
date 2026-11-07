# Shore & Season — Original Music Kit

Original music briefs for the Shore & Season app. These tracks are contemporary atmosphere pieces inspired by coast, season, and harvest. They do not imitate Indigenous ceremonial music, traditional songs, or nation-specific instruments.

## Published app track · Follow the Water

The Suno track shared by the project owner is wired into the persistent **Listen** background player. Its Suno embed stays mounted while visitors browse, and the share link remains available in the player.

- [Open Follow the Water on Suno](https://suno.com/s/V6RTrYJykuAwoZAI)
- Embed player: `https://suno.com/embed/e99c7aef-153a-4090-9f47-f622a658f9b2`
- Artist account shown by Suno: sunsetsandsfun

### Additional app tracks

- [After the Rain](https://suno.com/s/LX7GJt42QGtcObMp) · embed ID `98ca4e67-4bfd-45db-a5e3-cd2db6b3cd53`
- [Evening Settles on the Water](https://suno.com/s/EniD13JsL4fH9PU8) · embed ID `16301c83-f0c2-43c4-b82d-95b9d32af49c`
- [From Marsh to Shore](https://suno.com/s/kGSZJrkhRLvIFGqH) · embed ID `020d9e14-4c01-49d2-8cd1-57e7b7f7c86e`
- [shoreline ambience](https://suno.com/s/kvOhKTXmi0xq7W1U) · embed ID `e5c241cc-925e-4c1a-9eef-74baba4f83d6`

## 01 · Where the Water Remembers

**Use:** Main theme · home screen · app intro  
**Suno style prompt:** Cinematic coastal folk ambient, 78 BPM, warm hand-played acoustic guitar, soft frame drum, gentle piano, airy wordless choir, field-recording textures of tide and marsh grass, slow sunrise-to-sunset arc, reflective and hopeful, spacious, modern organic production, instrumental intro and outro. No imitation of specific Indigenous music or instruments.

**Lyrics**

```text
[Verse 1]
Where the river meets the morning
Where the green earth holds the rain
Hands have known the turning seasons
Long before we named the place

[Pre-Chorus]
Seed in the ground
Tide coming in
Stories are living
Begin again

[Chorus]
Follow the water, follow the shore
Listen for the names we’re learning more
From Florida green to the northern sky
The table is wide, the roots run deep
The stories live, the stories keep

[Verse 2]
Corn and beans beneath the sunlight
Salt wind moving through the trees
Every place has its own telling
Every people, memory

[Bridge]
Not one feast, not one day
Many voices, many ways
Come with care, come to know
Let the living stories grow

[Final Chorus]
Follow the water, follow the shore
Listen for the names we’re learning more
From Florida green to the northern sky
The table is wide, the roots run deep
The stories live, the stories keep
```

## 02 · Three Sisters, Morning Light

**Use:** Recipe browsing · harvest cards  
**Suno style prompt:** Bright modern acoustic folk instrumental, 92 BPM, fingerpicked guitar, rounded bass, hand percussion made with soft brushes and seed-shaker texture, light piano, warm string swells, a feeling of tending a garden after rain, communal and joyful, organic studio recording, no traditional or ceremonial motifs.

**Optional vocal refrain**

```text
One for the ground
One reaching high
One winding softly
Under the sky
Gather what’s ready
Leave room to grow
The garden remembers
What neighbors sow
```

## 03 · Big Cypress Evening

**Use:** Florida region · recipe detail screens  
**Suno style prompt:** Subtle Florida wetland ambient, 68 BPM, soft acoustic guitar harmonics, low piano notes, quiet brushed percussion, original field-recording ambience of evening insects and water, distant warm strings, humid twilight moving toward firelight, intimate and respectful, no imitation of tribal music, chants, or Indigenous instruments.

**Optional lyric fragment**

```text
Evening settles on the water
Warm light gathers, voices near
What we cook and what we carry
Keeps the shape of home right here
```

## 04 · Northbound, By the Tide

**Use:** Coast navigation · transition between regions  
**Suno style prompt:** Expansive instrumental folk journey, 84 BPM, gently pulsing acoustic guitar, piano motif, soft brushed drum, bowed cello, airy sustained vocal texture without words, changing coastal weather from southern marsh to northern shore, curious and hopeful, cinematic but understated, no borrowed Indigenous melodies or ceremonial rhythm.

## 05 · A Place at the Table

**Use:** Credits · closing screen · share card  
**Suno style prompt:** Gentle contemporary folk piano and guitar, 74 BPM, intimate close-mic performance, mellow bass, faint room and shoreline ambience, patient melody that opens into a warm final harmony, gratitude without sentimentality, reflective and welcoming, instrumental ending, no imitation of Indigenous music.

**Optional lyric fragment**

```text
Bring the story with you
Leave the doorway wide
There is room for learning
There is room beside
```

## Production notes

- Keep each track’s instrumentation contemporary and non-specific; do not prompt for tribal drums, chants, “Native American music,” or ceremonial sounds.
- Use the short prompts for Suno’s style field. Paste lyrics only for tracks intended to have vocals.
- For app use, export instrumental mixes and short loops (about 20–40 seconds) with clean intro/outro points.
- Keep room for the recipe names, community names, and source links in the interface; music should support the stories rather than compete with them.

## App background player

Shore & Season keeps the Suno embed mounted in a persistent player dock outside the app's redraw area. Playback continues while visitors filter regions and open recipe cards; the embed's own play/pause control remains the audio control. The player is user-started and does not autoplay. The dock exposes a playlist queue as more released tracks are added.

To add a track after it is published, append an object to `soundtrackTracks` in `src/main.js` with a stable `id`, `title`, `creator`, Suno `songId` (the ID used in `https://suno.com/embed/<songId>`), and its public `shareUrl`. The player builds the queue from this list. Keep the Suno embed and attribution; do not extract a stream URL or redistribute audio outside the rights granted for the track.
