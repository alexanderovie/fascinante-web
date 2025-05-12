// tailwind.config.js
import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors'; // Importar los colores por defecto

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: { // <--- CAMBIO CLAVE AQUÍ
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: { // Tus colores personalizados van aquí dentro de extend
        'black': '#121212',
        'secondary': '#64666C',
        'surface': '#F5F5F2',
        'blue': '#2868D8', // Ya tienes 'blue', Tailwind también tiene uno. El tuyo tendrá prioridad.
        'critical': '#EB4D4D',
        'success': '#37CC8E',
        'orange': '#EA603F',
        'white': '#FFFFFF', // Ya tienes 'white'.
        'deep-purple': '#15143B',
        'gradient': '#5D47E2',
        'dark': '#0F1E37',
        'grey': '#3F4B5F', // 'gray' es el nombre por defecto en Tailwind
        'dark-blue': '#173363',
        'dark-purple': '#130E38',
        'placehover': '#B1B1B1',
        'yellow': '#F2C94C', // Ya tienes 'yellow'.
        'line': 'rgba(0, 0, 0, 0.1)',
        // Puedes añadir los colores por defecto de Tailwind si quieres que también estén disponibles bajo sus nombres originales
        // o simplemente confiar en que no se sobrescriben si no los defines aquí.
        // Por ejemplo, para asegurar que los colores por defecto de Tailwind están disponibles:
        // ...colors, // Esto traería todos los colores por defecto de Tailwind
      },
    },
    // Si quieres mantener SOLO tus colores y los por defecto que necesitas,
    // podrías definir explícitamente los colores por defecto aquí fuera del extend:
    // colors: {
    //   ...colors, // Importa y esparce los colores por defecto de Tailwind
    //   transparent: 'transparent',
    //   current: 'currentColor',
    //   // Y luego TUS colores personalizados que pueden sobrescribir algunos de los por defecto:
    //   'black': '#121212',
    //   'secondary': '#64666C',
    //   // ...etc.
    // }
  },
  plugins: [],
};
export default config;