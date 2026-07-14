"use server";

import { db } from "./db";
import { sujets } from "./schema";

export interface SujetInput {
  annee: number;
  session: string;
  matiereId: number;
  serieId: number;
  sujetPdfUrl: string;
  corrigePdfUrl?: string;
}

// Fonction pour ajouter un sujet dans la base de données Supabase
export async function ajouterSujet(data: SujetInput) {
  try {
    const nouveauSujet = await db
      .insert(sujets)
      .values({
        annee: data.annee,
        session: data.session,
        matiereId: data.matiereId,
        serieId: data.serieId,
        sujetPdfUrl: data.sujetPdfUrl,
        corrigePdfUrl: data.corrigePdfUrl || null,
      })
      .returning();

    return { success: true, data: nouveauSujet[0] };
  } catch (error) {
    console.error("Erreur lors de l'ajout du sujet :", error);
    return { success: false, error: "Impossible d'enregistrer le sujet." };
  }
}
