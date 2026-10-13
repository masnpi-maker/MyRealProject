# DailyFlow

React + Vite užduočių planavimo programa su Supabase anonimine autentifikacija ir RLS.

## Paleidimas

1. Įdiekite Node.js LTS, tada paleiskite `npm install`.
2. Sukurkite Supabase projektą ir Authentication nustatymuose įjunkite Anonymous sign-ins.
3. Esamai duomenų bazei palikite esamas `tasks` ir `categories` lenteles; kategorijų funkcionalumui Supabase SQL Editor pritaikykite `supabase/migrations/002_enforce_task_category_ownership.sql`. Naujam tuščiam projektui pirmiausia taikykite `001_create_tasks.sql`, tada patikrinkite ir sukurkite reikiamą `categories` lentelę pagal jūsų schemą.
4. Nukopijuokite `.env.example` į `.env.local` ir įrašykite projekto URL bei anon/public publishable raktą. Publishable raktas turi pirmenybę. Nenaudokite `service_role` rakto.
5. Paleiskite `npm run dev`.

Sesiją valdo Supabase klientas, o anoniminės sesijos praradimas gali panaikinti prieigą prie jos užduočių. Pagrindinės komandos: `npm run test`, `npm run test:watch`, `npm run test:coverage`, `npm run build`.
