import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("La variable d'environnement DATABASE_URL est manquante !");
}

// Option ultra-compatible pour Supabase avec postgres-js
const client = postgres(connectionString, {
  ssl: "require",
  max: 1, // Limite le pool de connexions en mode dev pour éviter de saturer Supabase
  onnotice: () => {}, // Supprime les warnings inutiles dans ton terminal
});

export const db = drizzle(client, { schema });
