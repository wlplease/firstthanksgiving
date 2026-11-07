# Shore & Season

A responsive web app and Farcaster Mini App exploring Native foodways from Florida through the East Coast and Great Lakes. Florida is the default region.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The app uses a fixed viewport layout, sourced editorial cards, state and city search, region filters, optional geolocation, story deep links, and a source detail view with recipe steps. Visitors can share through the Web Share API, copy links, or compose a Farcaster cast. `src/data.js` holds the collection and citations. Recipes marked “modern adaptation” are identified separately from recipes published by Native sources.

## Farcaster publishing

The SDK calls `sdk.actions.ready()` inside a Mini App and uses `sdk.actions.composeCast()` for in-app sharing. Production builds generate the current `fc:miniapp` embed tag and a manifest at `/.well-known/farcaster.json`.

1. Choose a stable HTTPS origin. The domain must match the Farcaster Mini App registration.
2. Use [Farcaster Developer Tools](https://farcaster.xyz/~/developers/mini-apps/manifest) to generate the signed `accountAssociation` for that domain.
3. Set `APP_URL` and `FARCASTER_ACCOUNT_ASSOCIATION` in the deployment environment. For local builds, the generator also reads these values from the ignored `.env.local` file; `FARCASTER_ACCOUNT_ASSOCIATION_B64` is supported for JSON that is awkward to quote in dotenv files.
4. Run `npm run art && npm run build:miniapp`, deploy `dist/` at that origin, then validate the manifest and embed with the [Mini App Debug Tool](https://farcaster.xyz/~/developers/mini-apps).

Example for PowerShell:

```powershell
$env:APP_URL = 'https://your-domain.example'
$env:FARCASTER_ACCOUNT_ASSOCIATION = '{"header":"...","payload":"...","signature":"..."}'
npm run build:miniapp
```

The account association must be generated for the exact publishing domain. Localhost cannot be scraped by Farcaster; use a public development tunnel for embed testing.

## Editorial note

Cards are introductions to foodways, not historical recipe reconstructions. Additions should cite tribal or other authoritative sources, name the community precisely, and distinguish historical from contemporary food practices.
