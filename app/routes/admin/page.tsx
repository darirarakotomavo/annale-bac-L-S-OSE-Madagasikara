import { db } from '../../db/db';
import { ajouterSujet } from '../../db/actions';
import { redirect, useLoaderData } from 'react-router';

// 1. Le Loader s'exécute sur le serveur avant le rendu de la page
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const success = url.searchParams.get('success') === 'true';
  const errorMsg = url.searchParams.get('error');

  // Récupération des données depuis Supabase
  const listeSeries = await db.query.series.findMany({ orderBy: (series, { asc }) => [asc(series.nom)] });
  const listeMatieres = await db.query.matieres.findMany({ orderBy: (matieres, { asc }) => [asc(matieres.nom)] });

  return {
    success,
    errorMsg,
    listeSeries,
    listeMatieres
  };
}

// 2. L'Action gère la soumission du formulaire sur le serveur
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  
  try {
    const annee = Number(formData.get('annee'));
    const session = formData.get('session') as string;
    const serieId = Number(formData.get('serieId'));
    const matiereId = Number(formData.get('matiereId'));
    const sujetPdfUrl = formData.get('sujetPdfUrl') as string;
    const corrigePdfUrl = (formData.get('corrigePdfUrl') as string) || undefined;

    if (!annee || !serieId || !matiereId || !sujetPdfUrl) {
      throw new Error("Veuillez remplir tous les champs obligatoires.");
    }

    const reponse = await ajouterSujet({
      annee,
      session,
      serieId,
      matiereId,
      sujetPdfUrl,
      corrigePdfUrl,
    });

    if (reponse && reponse.success) {
      return redirect('/admin?success=true');
    } else {
      throw new Error(reponse?.error || "Une erreur inconnue est survenue.");
    }
  } catch (err: any) {
    if (err instanceof Response || (err && err.status === 302)) {
      throw err;
    }
    const message = encodeURIComponent(err.message || "Erreur de connexion");
    return redirect(`/admin?error=${message}`);
  }
}

// 3. Le Composant de rendu (simple et synchrone, plus besoin d'async !)
export default function AdminPage() {
  // On récupère facilement les données fournies par le loader ci-dessus
  const { success, errorMsg, listeSeries, listeMatieres } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🇲🇬 Panneau d'Administration - Annales Bac Madagasikara
      </h1>

      {/* Message de succès */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center font-medium">
          🎉 L'annale a été publiée avec succès dans Supabase !
        </div>
      )}

      {/* Message d'erreur */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium">
          ⚠️ Échec de la publication : {decodeURIComponent(errorMsg)}
        </div>
      )}

      {/* Formulaire utilisant la méthode POST standard de React Router */}
      <form method="POST" className="space-y-5">
        
        {/* Année & Session */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
            <input 
              type="number" 
              name="annee" 
              placeholder="Ex: 2025"
              min="1990"
              max="2030"
              required 
              className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
            <select 
              name="session" 
              className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Principale">Principale</option>
              <option value="Remplacement">Remplacement</option>
            </select>
          </div>
        </div>

        {/* Sélection de la Série */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Série du Baccalauréat</label>
          <select 
            name="serieId" 
            required 
            className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Choisir une série --</option>
            {listeSeries.map((s) => (
              <option key={s.id} value={s.id}>{s.nom} - {s.description}</option>
            ))}
          </select>
        </div>

        {/* Sélection de la Matière */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
          <select 
            name="matiereId" 
            required 
            className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Choisir une matière --</option>
            {listeMatieres.map((m) => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>

        {/* Liens des PDF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lien URL du Sujet (PDF)</label>
          <input 
            type="url" 
            name="sujetPdfUrl" 
            placeholder="https://example.com/sujet.pdf"
            required 
            className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lien URL du Corrigé (PDF - Optionnel)</label>
          <input 
            type="url" 
            name="corrigePdfUrl" 
            placeholder="https://example.com/corrige.pdf"
            className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Bouton d'envoi */}
        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          Publier l'Annale sur la Plateforme
        </button>
      </form>
    </div>
  );
}