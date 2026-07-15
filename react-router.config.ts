import type { Config } from "@react-router/dev/config";
// @ts-ignore - Le module est résolu par Vercel lors du build mais absent en local
import { vercelPreset } from "@react-router/dev/vercel";

export default {
  // Config options...
  ssr: true,
  
  // Utilisation directe du preset maintenant que TypeScript ignore l'import
  presets: [vercelPreset()],
} satisfies Config;