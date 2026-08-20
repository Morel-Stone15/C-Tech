# CLUB-Tech — Site de l'initiative universitaire

**Apprends. Code. Innove.** — Site vitrine du club tech étudiant : hackathons, workshops, projets
open source, mentorat et compétitions de code.

Stack : **React 19 + Vite 7 + TypeScript + Tailwind CSS 4**, inscriptions enregistrées dans
**Supabase**, notification optionnelle par e-mail via **EmailJS**.

---

## Lancer le projet

```bash
npm install     # une seule fois
npm run dev     # ➜ http://localhost:5173
```

Autres commandes :

```bash
npm run build     # génère dist/ (fichier unique autonome)
npm run preview   # prévisualise le build ➜ http://localhost:4173
```

Grâce à `vite-plugin-singlefile`, le build produit un **unique `dist/index.html`**
(HTML + CSS + JS inline) : double-cliquez dessus ou déposez-le sur n'importe quel hébergement.

---

## Configurer les inscriptions (Supabase)

Les étudiants peuvent s'inscrire de deux façons :

- **Inscription rapide** dès le Hero (prénom + e-mail, en haut de page).
- **Formulaire complet** dans la section « Rejoindre » (filière, niveau, centres d'intérêt, motivation).

Les deux écrivent dans la même table Supabase `inscriptions`. **Sans configuration, le site
fonctionne en mode démonstration** (rien n'est enregistré) — pour activer l'enregistrement réel :

### 1. Créer le projet Supabase

Sur [supabase.com/dashboard](https://supabase.com/dashboard), créez un projet (gratuit).

### 2. Créer la table

Dans **SQL Editor ▸ New query**, collez et exécutez le contenu de
[`supabase/schema.sql`](./supabase/schema.sql). Ça crée la table `inscriptions` avec :

- un index unique sur l'e-mail (pas de doublons),
- la sécurité niveau ligne (RLS) activée,
- une politique qui autorise le site à **insérer** des inscriptions, mais jamais à les lire —
  seul le bureau du club, via le dashboard Supabase, peut consulter les données.

### 3. Récupérer les clés et compléter `.env.local`

Sur **Project Settings ▸ API** :

| Variable | Où le trouver |
|---|---|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | Project API keys ▸ `anon` `public` (⚠️ jamais la clé `service_role`) |

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> ⚠️ Le préfixe `VITE_` est obligatoire. **Redémarrez `npm run dev`** après modification.

### 4. Consulter les inscriptions

Dashboard Supabase ▸ **Table Editor** ▸ `inscriptions`.

---

## Configurer l'envoi d'e-mails (EmailJS — optionnel)

En plus de l'enregistrement en base, le formulaire complet peut notifier le bureau du club par
e-mail à chaque nouvelle inscription. C'est optionnel : si non configuré, l'inscription est
enregistrée normalement, simplement sans notification.

### 1. Récupérer les 3 paramètres

Sur [dashboard.emailjs.com](https://dashboard.emailjs.com) :

| Paramètre | Où le trouver |
|---|---|
| `SERVICE_ID` | **Email Services** → connecter Gmail / Outlook / SMTP |
| `TEMPLATE_ID` | **Email Templates** → créer un modèle |
| `PUBLIC_KEY` | **Account ▸ General ▸ API Keys ▸ Public Key** |

### 2. Compléter `.env.local`

```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

### 3. Variables du modèle EmailJS

| Variable | Champ |
|---|---|
| `{{from_name}}` | Nom complet |
| `{{from_email}}` | E-mail *(à placer en « Reply-To »)* |
| `{{filiere}}` | Filière & année |
| `{{niveau}}` | Niveau en code |
| `{{interets}}` | Pôles d'intérêt sélectionnés |
| `{{message}}` | Motivation |
| `{{sent_at}}` | Date d'envoi |
| `{{to_email}}` | Destinataire |

---

## Liens du club (réseaux, mentions légales)

Centralisés dans `src/config/links.ts` — à personnaliser avant mise en production (Discord,
GitHub, Instagram, LinkedIn, pages légales).

---

## Identité visuelle

| Élément | Valeur |
|---|---|
| Indigo | `#4B2AE8` |
| Violet | `#7C3AED` |
| Bleu électrique | `#2563EB` |
| Cyan | `#3EC6E0` |
| Encre | `#0B1020` |
| Fond | `#F5F6FA` |
| Titres | **Space Grotesk** (bold) |
| Corps | **Inter** |

Le logotype joue le contraste du logo : **CLUB-T** en gras + *ech* en régulier.

---

## Structure

```
src/
├── components/
│   ├── Header.tsx        Nav pilule + scrollspy + progression
│   ├── Hero.tsx          Particules canvas, formes flottantes, inscription rapide
│   ├── About.tsx         Qui sommes-nous (mise en page asymétrique)
│   ├── Activities.tsx    6 cartes d'activités à dégradé
│   ├── Projects.tsx      Portfolio filtrable + badges techno
│   ├── Events.tsx        Événements (date en gros chiffres)
│   ├── Stats.tsx         Compteurs animés au scroll
│   ├── Testimonials.tsx  Carrousel tactile + clavier
│   ├── Partners.tsx      Marquee double sens
│   ├── Join.tsx          Formulaire d'adhésion complet (Supabase + EmailJS)
│   ├── Footer.tsx        Newsletter, réseaux, liens
│   ├── Overlays.tsx      Notifications toast
│   ├── icons.tsx         Icônes SVG + logo CLUB-Tech
│   └── ui.tsx            Boutons, titres, badges techno
├── config/
│   ├── supabase.ts       Client Supabase + saveInscription()
│   ├── emailjs.ts        Paramètres EmailJS
│   └── links.ts          Réseaux sociaux & liens légaux
├── lib/
│   ├── hooks.ts          useInView, useCountUp, useScrollSpy…
│   └── bus.ts            Bus d'événements (toasts)
└── index.css             Palette, dégradés animés, révélations

supabase/
└── schema.sql            Table `inscriptions` + politique RLS à exécuter une fois
```

**Note sur l'ordre des sections** — la page se lit dans l'ordre : Accueil → Membres (qui
sommes-nous) → Ressources (nos activités) → Projets → Événements → Statistiques → Témoignages →
Partenaires → Rejoindre. Le menu de navigation suit ce même ordre.

## Accessibilité

- Navigation clavier complète (carrousel ← →, menus, lien d'évitement).
- `prefers-reduced-motion` respecté : particules figées, marquees et compteurs désactivés.
- Contrastes conformes, `aria-*` sur tous les composants interactifs.
