-- ============================================================
--  CLUB-Tech — Schéma Supabase pour les inscriptions
-- ============================================================
--  À exécuter une fois dans : Supabase Dashboard ▸ SQL Editor ▸ New query
-- ============================================================

create table if not exists inscriptions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nom         text not null,
  email       text not null,
  filiere     text,
  niveau      text,
  interets    text[],
  message     text,
  source      text not null default 'formulaire' check (source in ('formulaire', 'inscription_rapide'))
);

-- Empêche les doublons d'inscription pour un même e-mail
create unique index if not exists inscriptions_email_key on inscriptions (lower(email));

-- Active la sécurité niveau ligne (obligatoire pour exposer la table au client)
alter table inscriptions enable row level security;

-- Autorise n'importe qui (y compris les visiteurs non connectés, via la clé
-- "anon") à INSÉRER une inscription — mais jamais à LIRE, MODIFIER ou
-- SUPPRIMER les données des autres. C'est le comportement voulu pour un
-- formulaire public : le site peut écrire, seul le bureau du club (via le
-- dashboard Supabase) peut consulter les inscriptions.
create policy "Le public peut s'inscrire"
  on inscriptions
  for insert
  to anon
  with check (true);

-- (Optionnel) Pour consulter les inscriptions depuis un futur back-office
-- authentifié, ajoutez une politique de lecture réservée aux utilisateurs
-- authentifiés, par exemple :
--
-- create policy "Le bureau peut lire les inscriptions"
--   on inscriptions
--   for select
--   to authenticated
--   using (true);
