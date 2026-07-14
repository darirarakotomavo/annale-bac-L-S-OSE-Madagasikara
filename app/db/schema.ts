import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // 💡 Importation de l'outil de Drizzle pour définir les liaisons (relations)

// =========================================================================
// 1. TABLE DES MATIÈRES
// =========================================================================
export const matieres = pgTable("matieres", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 10 }).notNull().unique(),
});

// =========================================================================
// 2. TABLE DES SÉRIES
// =========================================================================
export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 10 }).notNull().unique(),
  description: text("description"),
});

// =========================================================================
// 3. TABLE DE LIAISON (COEFFICIENTS PAR SÉRIE)
// =========================================================================
export const matieresSeries = pgTable(
  "matieres_series",
  {
    id: serial("id").primaryKey(),
    matiereId: integer("matiere_id")
      .notNull()
      .references(() => matieres.id, { onDelete: "cascade" }),
    serieId: integer("serie_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    coefficient: integer("coefficient").notNull(),
  },
  (t) => ({
    unq: unique().on(t.matiereId, t.serieId),
  })
);

// =========================================================================
// 4. TABLE DES SUJETS (ANNALES)
// =========================================================================
export const sujets = pgTable("sujets", {
  id: serial("id").primaryKey(),
  annee: integer("annee").notNull(),
  session: varchar("session", { length: 20 }).notNull().default("Principale"),
  matiereId: integer("matiere_id")
    .notNull()
    .references(() => matieres.id),
  serieId: integer("serie_id")
    .notNull()
    .references(() => series.id),
  sujetPdfUrl: text("sujet_pdf_url").notNull(),
  corrigePdfUrl: text("corrige_pdf_url"),
});

// =========================================================================
// 5. CONFIGURATION DES RELATIONS (Mécanisme de liaison pour Drizzle ORM)
// =========================================================================

/**
 * Relations pour la table 'sujets' :
 * On explique à Drizzle qu'un "sujet" est lié à :
 *  - Une "matiere" unique via la colonne 'matiereId'
 *  - Une "serie" unique via la colonne 'serieId'
 * C'est ce qui permet de faire "with: { matiere: true, serie: true }" dans notre loader !
 */
export const sujetsRelations = relations(sujets, ({ one }) => ({
  matiere: one(matieres, {
    fields: [sujets.matiereId],
    references: [matieres.id],
  }),
  serie: one(series, {
    fields: [sujets.serieId],
    references: [series.id],
  }),
}));

/**
 * Relations pour la table 'matieres' :
 * On explique à Drizzle qu'une "matiere" peut être liée à plusieurs "sujets" (relation un-à-plusieurs).
 */
export const matieresRelations = relations(matieres, ({ many }) => ({
  sujets: many(sujets),
}));

/**
 * Relations pour la table 'series' :
 * On explique à Drizzle qu'une "serie" peut être liée à plusieurs "sujets" (relation un-à-plusieurs).
 */
export const seriesRelations = relations(series, ({ many }) => ({
  sujets: many(sujets),
}));
