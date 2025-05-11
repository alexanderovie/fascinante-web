// src/app/website-audit/page.tsx
'use client';

import { useState, FormEvent } from 'react';

// --- Interfaces (se mantienen igual) ---
interface PageSpeedCategoryScore {
  id: string;
  title: string;
  score: number | null;
  displayValue?: string;
}

interface LighthouseResult {
  categories: {
    performance: PageSpeedCategoryScore;
    accessibility: PageSpeedCategoryScore;
    'best-practices': PageSpeedCategoryScore;
    seo: PageSpeedCategoryScore;
    // pwa?: PageSpeedCategoryScore;
  };
  audits?: {
    'final-screenshot'?: {
      details?: {
        data: string;
      }
    }
  };
  requestedUrl?: string;
  finalUrl?: string;
}

interface PageSpeedApiResult {
  lighthouseResult?: LighthouseResult;
  loadingExperience?: {
    metrics: {
      [key: string]: {
        percentile: number;
        category: string;
      }
    } | null;
  } | null;
  error?: {
    code: number;
    message: string;
    errors: Array<{ message: string; domain: string; reason: string }>;
  };
}

// --- Componente de Página ---
export default function WebsiteAuditPage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<PageSpeedApiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResults(null);

    if (!url) {
      setError('Por favor, ingresa la URL de un sitio web.');
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        setError('Por favor, ingresa una URL válida (ej. https://example.com)');
        return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/pagespeed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data: PageSpeedApiResult = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Error al auditar (HTTP ${response.status})`);
      }
      
      if (data.error) {
        console.error("Error de la API de PageSpeed:", data.error);
        setError(`Error de PageSpeed: ${data.error.message}`);
      } else if (!data.lighthouseResult) {
        setError('No se encontraron resultados de Lighthouse para esta URL. Puede que no sea pública o auditable.');
        console.warn("Respuesta de PageSpeed sin lighthouseResult:", data);
      } else {
        setResults(data);
      }

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLighthouseScoresHorizontal = (categories: LighthouseResult['categories'] | undefined) => {
    if (!categories) {
      return <p style={{ width: '100%', textAlign: 'center' }}>No se pudieron cargar las categorías de Lighthouse.</p>;
    }

    const scoresToDisplay: (keyof LighthouseResult['categories'])[] = ['performance', 'accessibility', 'best-practices', 'seo'];
    
    return scoresToDisplay.map(key => {
      const category = categories[key];
      const title = category?.title || key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
      const score = typeof category?.score === 'number' ? Math.round(category.score * 100) : null;

      return (
        <div 
          key={key} 
          style={{ 
            border: '1px solid #e0e0e0',
            padding: '20px',
            borderRadius: '8px', 
            backgroundColor: '#ffffff',
            textAlign: 'center',
            flex: '1 1 200px',
            minWidth: '180px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <h3 style={{ marginTop: '0', marginBottom: '10px', fontSize: '1.1em', color: '#333' }}>
            {title}
          </h3>
          {score !== null ? (
            <p style={{ 
              fontSize: '2.2em', 
              fontWeight: 'bold', 
              margin: '5px 0 0 0',
              color: score >= 90 ? '#34a853' : score >= 50 ? '#fbbc05' : '#ea4335'
            }}>
              {score}
            </p>
          ) : (
            <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#757575', margin: '5px 0 0 0' }}>N/A</p>
          )}
        </div>
      );
    });
  };

  // --- JSX del Componente ---
  return (
    // El estilo en línea del div principal puede ser reemplazado por clases de Tailwind si tienes un contenedor global,
    // ej: className="container mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:px-8"
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        {/* Estas clases para h1 y p son ejemplos, ajústalos a tu sistema de diseño Tailwind */}
        <h1 className="text-3xl font-bold text-gray-800">Auditoría Web Simple</h1>
        <p className="text-md text-gray-600 mt-2">Ingresa una URL para obtener un informe básico de PageSpeed Insights.</p>
      </header>

      {/* FORMULARIO CON ESTILOS DE TAILWIND ADAPTADOS DE ContactStyleOne */}
      <form 
        onSubmit={handleSubmit} 
        // Clases de Tailwind para el layout del formulario
        className="flex flex-col sm:flex-row items-center gap-3 mb-10" // sm:flex-row para que en pantallas pequeñas sea columna
      >
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          placeholder="https://ejemplo.com"
          required
          // Clases del formulario de contacto: "w-full bg-surface text-secondary caption1 px-4 py-3 rounded-lg"
          // Adaptadas:
          // - 'flex-grow' para que el input se expanda.
          // - 'sm:w-auto' para que en pantallas pequeñas (cuando es columna) ocupe el ancho y en grandes se ajuste al flex-grow.
          // - Asegúrate que 'bg-surface', 'text-secondary', 'caption1' estén definidas en tu Tailwind/CSS.
          // - 'focus:ring-blue-500 focus:border-blue-500' son ejemplos de estilos de foco.
          className="flex-grow w-full sm:w-auto bg-surface text-secondary caption1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isLoading}
          // Clases del formulario de contacto: "button-main hover:border-blue bg-blue text-white text-button rounded-full"
          // Adaptadas, incluyendo padding, estado de carga y transiciones:
          // - 'w-full sm:w-auto' para responsividad.
          // - 'px-6 py-3' para un padding generoso.
          // - Asegúrate que 'button-main', 'text-button', 'bg-blue' (o el color que uses) estén definidos.
          className={`button-main text-white text-button rounded-full px-6 py-3 w-full sm:w-auto transition-colors duration-150 ease-in-out whitespace-nowrap
                      ${isLoading 
                        ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue hover:bg-blue-600' // Reemplaza 'bg-blue' por tu clase de color principal si es diferente
                      }`}
        >
          {isLoading ? 'Auditando...' : 'Auditar Sitio'}
        </button>
      </form>

      {isLoading && <p className="text-center text-lg text-gray-600 my-5">Cargando resultados...</p>}
      
      {error && (
        // Clases de Tailwind para el mensaje de error, ejemplo:
        <p className="text-center text-red-600 bg-red-100 border border-red-300 p-3 rounded-md my-5">
          Error: {error}
        </p>
      )}

      {results && !error && (
        <div>
          {results.lighthouseResult && results.lighthouseResult.requestedUrl && (
            // Ejemplo de clases para el encabezado de resultados
            <h2 className="text-center text-xl font-semibold text-gray-700 mb-5">
              Resultados para: <a href={results.lighthouseResult.requestedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{results.lighthouseResult.requestedUrl}</a>
            </h2>
          )}

          {/* Contenedor para las puntuaciones horizontales */}
          <div className="flex flex-row flex-wrap justify-around gap-5 mb-10">
            {results.lighthouseResult ? 
              renderLighthouseScoresHorizontal(results.lighthouseResult.categories) :
              <p className="w-full text-center text-gray-600">No se encontraron datos de Lighthouse para esta URL.</p> 
            }
          </div>
          
          {/* Indicador simple para Core Web Vitals (datos de campo) */}
          {(results.loadingExperience && results.loadingExperience.metrics && Object.keys(results.loadingExperience.metrics).length > 0) || 
           (results.loadingExperience && (!results.loadingExperience.metrics || Object.keys(results.loadingExperience.metrics).length === 0)) ? (
            // Ejemplo de clases para la sección de Core Web Vitals
            <div className="mt-8 pt-5 pb-5 border-t border-gray-200 bg-gray-50 rounded-lg">
              <h3 className="text-center text-lg font-semibold text-gray-700 mt-0 mb-3">Experiencia de Carga (Core Web Vitals)</h3>
              {results.loadingExperience.metrics && Object.keys(results.loadingExperience.metrics).length > 0 ? (
                <p className="text-center text-green-600 text-lg">Se encontraron datos de campo para esta URL.</p>
              ) : (
                <p className="text-center text-gray-500">No se encontraron métricas de datos de campo para esta URL.</p>
              )}
            </div>
          ) : null }
        </div>
      )}
    </div>
  );
}