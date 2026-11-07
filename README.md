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

## Apple app (iPhone, iPad, and Mac)

The `ios/` folder is a Capacitor Xcode project. Build web assets and sync native plugins with `npm run build:ios`, then open it on a Mac with `npm run open:ios`. In Xcode, choose the App target, set your Team under Signing & Capabilities, confirm the bundle identifier (`com.shoreseason.app`) is available to your account, and run on an iPhone or iPad simulator before archiving. Set availability for iPhone and iPad in the App Store distribution settings. Apple silicon Macs can run compatible iPad apps when Mac availability is enabled in App Store Connect; a separately designed Mac Catalyst experience requires additional Xcode work and verification on a Mac.

Native builds use the iOS share sheet for sharing, open cited websites in Safari, preserve the iPhone safe area, and use the native launch screen. Farcaster builds continue to use the Farcaster SDK. The soundtrack is currently streamed through individual Suno embeds. Suno does not expose a supported embed playlist API or track-ended event, so the app cannot guarantee automatic next-track playback; listeners can choose each track in the queue. To provide reliable automatic playback, add audio files that are licensed for distribution and use an app-owned audio player with a queue.

After web changes, run `npm run build:ios` and reopen/rebuild in Xcode. After changing native plugins, sync the iOS project again. Build and signing must be completed on macOS with Xcode and your Apple Developer account.

## Farcaster publishing

The SDK calls `sdk.actions.ready()` inside a Mini App and uses `sdk.actions.composeCast()` for in-app sharing. Production builds generate the current `fc:miniapp` embed tag and a manifest at `/.well-known/farcaster.json`.

1. Keep the production origin at `https://shoreseason.vercel.app`; the signed association is tied to that exact domain.
2. The production association is included in `scripts/miniapp-config.mjs`, so hosted builds do not depend on the ignored `.env.local` file. The generator checks that its signed domain matches `APP_URL` or Vercel’s production URL and stops with a clear error if they differ.
3. If the production domain changes, generate a new signed `accountAssociation` in [Farcaster Developer Tools](https://farcaster.xyz/~/developers/mini-apps/manifest) and update the generator’s `defaultAssociation`. `APP_URL` and either association environment variable still override the local default.
4. Run `npm run build:miniapp`, deploy `dist/` at that origin, then validate the manifest and embed with the [Mini App Debug Tool](https://farcaster.xyz/~/developers/mini-apps).

Example for PowerShell:

```powershell
$env:APP_URL = 'https://your-domain.example'
$env:FARCASTER_ACCOUNT_ASSOCIATION = '{"header":"...","payload":"...","signature":"..."}'
npm run build:miniapp
```

The account association must be generated for the exact publishing domain. Localhost cannot be scraped by Farcaster; use a public development tunnel for embed testing.

## Editorial note

Cards are introductions to foodways, not historical recipe reconstructions. Additions should cite tribal or other authoritative sources, name the community precisely, and distinguish historical from contemporary food practices.
