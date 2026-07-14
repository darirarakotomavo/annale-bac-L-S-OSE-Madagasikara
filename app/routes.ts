import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Page d'accueil (index)
  index("routes/home.tsx"),

  // Nouvelle page d'administration (chemin corrigé !)
  route("admin", "routes/admin/page.tsx"),
] satisfies RouteConfig;