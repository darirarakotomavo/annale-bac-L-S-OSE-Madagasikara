import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // On met la chaîne de connexion directement ici (remplace bien avec ton vrai mot de passe)
    url: "postgresql://postgres:d6r5r9r1ktmvDatabase@aws-0-af-south-1.pooler.supabase.com:6543/postgres",
  },
});
