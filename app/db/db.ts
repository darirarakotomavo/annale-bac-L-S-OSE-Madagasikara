import dns from "dns";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// ✅ Force la résolution DNS en IPv4 (contourne les problèmes IPv6 sur Vercel)
dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("La variable d'environnement DATABASE_URL est manquante !");
}

// Connexion à Supabase (avec SSL et pool limité)
const client = postgres(connectionString, {
  ssl: "require",
  max: 1,
  onnotice: () => {},
});

export const db = drizzle(client, { schema });
