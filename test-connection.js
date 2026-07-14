import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error(
    "❌ DATABASE_URL non définie dans les variables d'environnement"
  );
  process.exit(1);
}

console.log("🔌 Tentative de connexion à Supabase...");

const sql = postgres(url, {
  ssl: { rejectUnauthorized: false }, // parfois nécessaire
});

try {
  const result = await sql`SELECT 1 as test`;
  console.log("✅ Connexion réussie ! Résultat :", result);
} catch (err) {
  console.error("❌ Échec de connexion :", err.message);
  console.error("Détails complets :", err);
} finally {
  await sql.end();
  process.exit();
}
