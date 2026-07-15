import { db } from '../db/db';
import { useLoaderData } from 'react-router';

/**
 * Définition manuelle des types pour garantir à TypeScript
 * que nos objets contiennent bien toutes les propriétés requises.
 */
interface Serie {
  id: number;
  nom: string;
  description: string | null;
}

interface Matiere {
  id: number;
  nom: string;
}

interface Sujet {
  id: number;
  annee: number;
  session: string;
  sujetPdfUrl: string;
  corrigePdfUrl: string | null;
  serie?: Serie | null;
  matiere?: Matiere | null;
}

/**
 * 1. LE LOADER (S'exécute côté Serveur)
 * Récupère les données depuis Supabase via Drizzle ORM.
 */
export async function loader() {
  try {
    const annales = await db.query.sujets.findMany({
      // Jointure automatique des relations configurées dans ton schéma
      with: {
        serie: true,
        matiere: true,
      },
      // Tri par année décroissante
      orderBy: (sujets, { desc }) => [desc(sujets.annee)],
    });

    // On force le typage pour rassurer TypeScript sur la structure
    return { annales: annales as unknown as Sujet[] };
  } catch (error) {
    console.error("Erreur lors de la récupération des annales :", error);
    return { annales: [] as Sujet[] };
  }
}

/**
 * 2. LE COMPOSANT PUBLIC (S'exécute côté Client)
 * Construit l'interface utilisateur.
 */
export default function HomePage() {
  const { annales } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* En-tête de la page */}
      <header className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-4xl mb-2 block">🇲🇬</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Annales du Baccalauréat Madagascar
          </h1>
          <p className="mt-2 text-lg text-blue-100 max-w-2xl mx-auto">
            Accédez gratuitement aux sujets officiels et corrigés du Bac Malagasy pour réussir vos examens !
          </p>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📚 Dernières annales publiées
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {annales.length} {annales.length > 1 ? 'disponibles' : 'disponible'}
          </span>
        </h2>

        {annales.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 p-8">
            <p className="text-gray-500 text-lg">Aucun sujet n'a encore été publié sur la plateforme.</p>
            <p className="text-sm text-gray-400 mt-1">Rendez-vous sur l'interface d'administration pour ajouter une annale.</p>
          </div>
        ) : (
          /* Grille de cartes */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annales.map((annale) => (
              <div 
                key={annale.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Corps de la carte */}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    {/* Badge Année & Session */}
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {annale.annee} — {annale.session}
                    </span>
                    {/* Badge Série */}
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                      Série {annale.serie?.nom || 'Inconnue'}
                    </span>
                  </div>

                  {/* Titre : Nom de la matière */}
                  <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">
                    {annale.matiere?.nom || 'Matière inconnue'}
                  </h3>
                  
                  {/* Description de la série */}
                  <p className="text-xs text-gray-500 italic">
                    {annale.serie?.description || 'Aucune description'}
                  </p>
                </div>

                {/* Pied de la carte avec accès aux fichiers PDF (camelCase validé par TypeScript) */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex gap-3">
                  
                  {/* Bouton Sujet */}
                  <a 
                    href={annale.sujetPdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-sm"
                  >
                    📄 Sujet PDF
                  </a>

                  {/* Bouton Corrigé */}
                  {annale.corrigePdfUrl ? (
                    <a 
                      href={annale.corrigePdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center text-sm font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-sm"
                    >
                      ✅ Corrigé
                    </a>
                  ) : (
                    <span className="flex-1 bg-gray-200 text-gray-400 text-center text-sm font-medium py-2 px-4 rounded-lg cursor-not-allowed">
                      Pas de corrigé
                    </span>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}

      </main>
      {/* Pied de page */}
      <footer className="bg-gray-950 text-gray-400 py-8 mt-12 border-t border-gray-800 text-xs">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
          
          <div className="space-y-1">
            <p className="text-gray-300 font-semibold text-sm">
              Site web responsive conçu et développé par <span className="text-blue-400 font-bold">Richard RAKOTOMAVO</span>
            </p>
            <p className="text-gray-400 font-medium">
              Développeur Autodidacte - Professeur de Physique 
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-gray-400 mt-2">
            <span className="font-semibold text-gray-500">Contact :</span>
            
            {/* Bouton de copie pour Facebook (Non cliquable vers un lien) */}
            <button 
              onClick={(e) => {
                navigator.clipboard.writeText("Autodidacte Ramose Richard Physique");
                const btn = e.currentTarget;
                const originalText = btn.innerHTML;
                btn.innerHTML = "✅ Copié !";
                setTimeout(() => { btn.innerHTML = originalText; }, 2000);
              }}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-gray-400 font-normal"
              title="Cliquez pour copier le nom"
            >
              👤 Facebook : <span className="underline mr-1">Autodidacte Ramose Richard Physique</span> 📋
            </button>

            {/* Lien WhatsApp Direct */}
            <a 
              href="https://wa.me/261322462274" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              📞 WhatsApp : <span className="underline">032 24 622 74</span>
            </a>
          </div>

          <div className="w-12 h-px bg-gray-800 my-1"></div>
          
          <p className="text-gray-600">
            Plateforme d'Annales Bac Madagasikara créée par Richard RAKOTOMAVO. Tous droits réservés. © {new Date().getFullYear()}
          </p>

        </div>
      </footer>
    </div>
  );
}
