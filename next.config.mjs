// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true, // Esta es una opción común y a menudo activada por defecto. Puedes mantenerla si la tienes.
  
  // Aquí puedes añadir otras configuraciones específicas que necesites,
  // como dominios para imágenes, etc., pero si no tienes ninguna,
  // un objeto vacío también es válido.

  // POR AHORA, VAMOS A QUITAR COMPLETAMENTE LOS BLOQUES problemáticos:
  // async rewrites() { ... } // Eliminado o comentado
  // async headers() { ... }  // Eliminado o comentado (o hacerlo más específico después)
};

export default nextConfig;