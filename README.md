# MEDICOPLACE

> **Votre plateforme de santé de confiance** — Consultations médicales, pharmacie en ligne, téléconsultation et plus encore.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide Icons**

## Project Structure

```
src/
├── app/           # Route pages + root layout
├── components/    # Reusable UI, layout, section, shop, dashboard components
├── data/          # French dummy data (products, services, FAQ)
├── lib/           # Context providers (cart, auth) and utilities
└── types/         # Shared TypeScript interfaces
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/a-propos` | About page |
| `/services` | Medical services |
| `/contact` | Contact form |
| `/faq` | FAQ page |
| `/inscription` | Registration |
| `/connexion` | Login |
| `/mot-de-passe-oublie` | Forgot password |
| `/reinitialiser-mot-de-passe` | Reset password |
| `/tableau-de-bord` | Patient dashboard |
| `/tableau-de-bord/profil` | User profile |
| `/tableau-de-bord/historique` | History |
| `/tableau-de-bord/rendez-vous` | Appointments |
| `/boutique` | Shop / Pharmacy |
| `/boutique/[id]` | Product details |
| `/panier` | Cart |
| `/paiement` | Checkout |
| `/teleconsultation` | Teleconsultation (coming soon) |

## License

MIT
