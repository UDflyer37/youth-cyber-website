# Cyber Adventure Playground

A free after school cybersecurity program for elementary and middle school students, run by
**Indian River Middle School**. Five short missions teach the ideas that matter most: password
strength, encryption, phishing, creative coding, and how machine learning actually sees a face.

The site was originally built in [Anvil](https://anvil.works). It now runs on **Next.js 16** and deploys
to **Vercel** as a fully static site.

## What's inside

| Mission | Route | What students do |
| --- | --- | --- |
| Password Power-Up | `/missions/passwords` | Score a made-up password live, read why each rule matters, generate a passphrase, see an estimated crack time. |
| Code Breaker Academy | `/missions/cipher` | Encrypt and decrypt with a Caesar cipher, watch the alphabet mapping shift, then crack three secret messages. |
| Phishing Defender | `/missions/phishing` | Ten realistic inbox messages, safe-or-scam decisions, and an explanation of the clues after every answer. |
| Scratch Arcade | `/missions/scratch` | Play three student projects embedded from Scratch, then a prompt to remix one. |
| AI Face Lab | `/ai-lab` | BlazeFace runs in the browser: face boxes, landmarks, and a drawing canvas that wraps onto the detected face. |

Extras:

- **Badge tracking** on the hub and every mission, stored in `localStorage` (no accounts, no server).
- **Grown-ups section** on the homepage with a suggested 45-minute session plan and a privacy summary.
- A drag-scrollable **mission gallery** with hover previews, plus the badge wallet in its header.
- Shaped section transitions, morphing shapes, a word band that bounces, poppable background bubbles, and
  scroll reveals. Motion is switched off for `prefers-reduced-motion`.
- Responsive layout, keyboard focus rings, `aria-live` result regions, and readable tap targets.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19
- Tailwind CSS v4 (`@theme` tokens in `app/globals.css`)
- TypeScript
- `@tensorflow/tfjs` + `@tensorflow-models/blazeface`, dynamically imported only on `/ai-lab`

There is no database, no API route, and no server-side state. All five activities run client-side, which is
why the site builds to static HTML and needs no environment variables.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

The AI Lab needs camera permission and a `localhost` or `https://` origin; browsers block `getUserMedia`
on plain HTTP hosts other than localhost.

## Deploy to Vercel

**Option A: Git integration (recommended)**

1. Push this repository to GitHub (the connected repo is `UDflyer37/youth-cyber-website`).
2. In Vercel, choose **Add New → Project** and import the repository.
3. Leave the defaults: Vercel detects Next.js, runs `npm install` and `npm run build`, and serves the
   output. No environment variables are required.
4. Deploy. Every later push to `master` ships to production, and pull requests get preview URLs.

**Option B: CLI**

```bash
npx vercel          # link the project and create a preview deployment
npx vercel --prod   # promote to production
```

**Cutting over from Anvil**

1. Deploy once on Vercel and check the five missions plus the AI Lab on the preview URL.
2. Point the program's domain at the Vercel project (**Settings → Domains**), and remove it from Anvil.
3. Keep `cyber-afterschool.anvil.app` alive for one term if you want a fallback, then delete the Anvil app.

The old Anvil files (`anvil.yaml`, `theme/`, `client_code/`, `server_code/`) are not part of the build but
remain in git history if you ever need to refer back to them.

## Project structure

```
app/
  layout.tsx              fonts, metadata, header/footer, skip link, bubbles, scroll progress
  page.tsx                hub: hero, bouncing band, mission gallery, rules, session plan, grown-ups
  globals.css             Tailwind theme tokens, shaped edges, bubbles, lab styles, motion
  missions/{passwords,cipher,phishing,scratch}/page.tsx
  ai-lab/page.tsx
components/
  site-header.tsx         sticky nav with a mobile sheet
  site-footer.tsx         ink footer with a scalloped top edge
  hero-orbit.tsx          morphing hero poster with orbiting mission medallions
  project-gallery.tsx     drag-scrollable arcade of mission previews, with the badge wallet
  mission-art.tsx         one hand-drawn SVG poster per mission
  word-bounce.tsx         bouncing word chips that collide inside the divider bar
  bubble-field.tsx        poppable background bubbles on every page
  mission-shell.tsx       shared mission layout: shaped banner, briefing, badge CTA, pager
  mission-complete.tsx    "I finished this mission" badge button
  progress-ring.tsx       badge wallet / reset control
  section-edge.tsx        wave, tear, arch, zig and scallop transitions between colour bands
  reveal.tsx magnetic.tsx scroll-progress.tsx
  icon.tsx
  labs/                   the five interactive activities
lib/
  missions.ts             mission catalog (title, route, accent color, skills, takeaway)
  progress.ts             localStorage badge store
```

### Adding a mission

1. Add an entry to `missions` in `lib/missions.ts` (accent colour drives the whole page theme).
2. Add `app/missions/<slug>/page.tsx` that renders a `<MissionShell>` around your activity component.
3. The mission gallery, footer links, previous/next pager, and badge total update automatically.
   Pick one of the five existing accent/tint pairs in `lib/missions.ts` (or add tokens in `globals.css`) so the
   mission header, buttons, and lab controls stay in theme.

## Privacy

- No accounts, cookies, analytics, or third-party trackers.
- AI Lab video is processed in the browser and never uploaded or recorded.
- Scratch projects are third-party content embedded from `scratch.mit.edu`; they only load after a click.
- Badges are stored on the student's own device, and the hub has a **Reset badges** button.

## License

[MIT](LICENSE.txt). Fork it, remix it, run it at your own school.

Questions about the program: [ottoa98@gmail.com](mailto:ottoa98@gmail.com)
