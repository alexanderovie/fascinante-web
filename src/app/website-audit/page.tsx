// src/app/website-audit/page.tsx
'use client';

import { useState, FormEvent } from 'react';
// Si quieres renderizar Markdown de las descripciones:
// import ReactMarkdown from 'react-markdown'; 

// --- Interfaces (se mantienen igual, `LighthouseResult` ya incluye `audits`) ---
interface PageSpeedCategoryScore {
  id: string;
  title: string;
  score: number | null;
  displayValue?: string;
}

// Definimos una interfaz más específica para una auditoría individual
interface AuditResult {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  details?: any; // Los detalles pueden tener cualquier estructura
  // Añade más campos según necesites de la auditoría
}

interface LighthouseResult {
  categories: {
    performance: PageSpeedCategoryScore & { auditRefs: AuditRef[] }; // Añadimos auditRefs aquí
    accessibility: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    'best-practices': PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    seo: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    // pwa?: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
  };
  audits: { // Objeto donde cada clave es un id de auditoría
    [auditId: string]: AuditResult;
  };
  requestedUrl?: string;
  finalUrl?: string;
  // ...otros campos de lighthouseResult
}

// Interfaz para las referencias de auditoría dentro de las categorías
interface AuditRef {
  id: string;
  weight: number;
  group?: string; // El grupo al que pertenece la auditoría (ej: 'diagnostics')
  // ...otros campos de auditRef
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

  const renderLighthouseScoresHorizontal = (categoriesData: LighthouseResult['categories'] | undefined) => {
    // ... (código se mantiene igual que en la respuesta anterior)
    if (!categoriesData) {
      return <p style={{ width: '100%', textAlign: 'center' }}>No se pudieron cargar las categorías de Lighthouse.</p>;
    }
    const scoresToDisplay: (keyof LighthouseResult['categories'])[] = ['performance', 'accessibility', 'best-practices', 'seo'];
    return scoresToDisplay.map(key => {
      const category = categoriesData[key];
      const title = category?.title || key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
      const score = typeof category?.score === 'number' ? Math.round(category.score * 100) : null;
      return (
        <div key={key} style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', backgroundColor: '#ffffff', textAlign: 'center', flex: '1 1 200px', minWidth: '180px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
          <h3 style={{ marginTop: '0', marginBottom: '10px', fontSize: '1.1em', color: '#333' }}>{title}</h3>
          {score !== null ? (
            <p style={{ fontSize: '2.2em', fontWeight: 'bold', margin: '5px 0 0 0', color: score >= 90 ? '#34a853' : score >= 50 ? '#fbbc05' : '#ea4335' }}>{score}</p>
          ) : (
            <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#757575', margin: '5px 0 0 0' }}>N/A</p>
          )}
        </div>
      );
    });
  };

  // --- NUEVA FUNCIÓN PARA RENDERIZAR DIAGNÓSTICOS ---
  const renderDiagnosticsSection = (lighthouseResult: LighthouseResult | undefined) => {
    if (!lighthouseResult || !lighthouseResult.categories?.performance?.auditRefs || !lighthouseResult.audits) {
      return null; // O un mensaje indicando que no hay datos de diagnóstico
    }

    const { audits, categories } = lighthouseResult;
    // Filtramos las referencias de auditoría del grupo 'diagnostics' en la categoría de performance
    // También consideramos auditorías que no son 'opportunities' y tienen un valor a mostrar o no son meramente informativas.
    const diagnosticAudits = categories.performance.auditRefs
      .filter(ref => ref.group === 'diagnostics' || (ref.group !== 'load-opportunities' && ref.group !== 'metrics'))
      .map(ref => audits[ref.id])
      .filter(audit => audit && (audit.scoreDisplayMode !== 'informative' || audit.displayValue) && audit.score !== null && audit.score < 1); // Mostrar solo los que no pasaron o tienen data

    if (diagnosticAudits.length === 0) {
      return (
        <div className="mt-8 pt-5 pb-5 border-t border-gray-200 bg-gray-50 rounded-lg">
          <h3 className="text-center text-lg font-semibold text-gray-700 mt-0 mb-3">Diagnósticos Adicionales</h3>
          <p className="text-center text-green-600">¡Buen trabajo! No se encontraron problemas de diagnóstico significativos que requieran atención inmediata o todas las auditorías de diagnóstico pasaron.</p>
        </div>
      );
    }

    return (
      <div className="mt-8 pt-5 pb-5 border-t border-gray-200 bg-gray-50 rounded-lg px-4">
        <h3 className="text-center text-lg font-semibold text-gray-700 mt-0 mb-5">Diagnósticos Adicionales</h3>
        <div className="space-y-4">
          {diagnosticAudits.map((audit) => (
            <div key={audit.id} className="p-4 border border-gray-200 rounded-md shadow-sm bg-white">
              <h4 className="font-semibold text-gray-700">{audit.title}</h4>
              {audit.displayValue && (
                <p className="text-sm text-gray-600 mt-1">
                  Valor: <span className="font-medium">{audit.displayValue}</span>
                </p>
              )}
              {/* La descripción puede contener Markdown. Para mostrarlo como HTML, necesitarías una librería. */}
              {/* Por ahora, lo mostramos como texto, o puedes usar dangerouslySetInnerHTML si confías en el contenido. */}
              <div 
                className="text-sm text-gray-500 mt-2 prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: audit.description.replace(/\[Learn more\]\(.*?\)/g, '') }} // Quita el enlace "Learn more" para simplificar
              />
              {/* Renderizar detalles es complejo, aquí un placeholder o ejemplo simple */}
              {/* {audit.details && audit.details.type === 'table' && <p className="text-xs mt-1 text-gray-400">(Contiene una tabla de detalles)</p>} */}
            </div>
          ))}
        </div>
      </div>
    );
  };


  // --- JSX del Componente ---
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:px-8"> {/* Usando clases de Tailwind para el contenedor principal */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Auditoría Web Simple</h1>
        <p className="text-md text-gray-600 mt-2">Ingresa una URL para obtener un informe básico de PageSpeed Insights.</p>
      </header>

      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col sm:flex-row items-center gap-3 mb-10"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          placeholder="https://ejemplo.com"
          required
          className="flex-grow w-full sm:w-auto bg-surface text-secondary caption1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`button-main text-white text-button rounded-full px-6 py-3 w-full sm:w-auto transition-colors duration-150 ease-in-out whitespace-nowrap
                      ${isLoading 
                        ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue hover:bg-blue-600'
                      }`}
        >
          {isLoading ? 'Auditando...' : 'Auditar Sitio'}
        </button>
      </form>

      {isLoading && <p className="text-center text-lg text-gray-600 my-5">Cargando resultados...</p>}
      
      {error && (
        <p className="text-center text-red-600 bg-red-100 border border-red-300 p-3 rounded-md my-5">
          Error: {error}
        </p>
      )}

      {results && !error && (
        <div>
          {results.lighthouseResult && results.lighthouseResult.requestedUrl && (
            <h2 className="text-center text-xl font-semibold text-gray-700 mb-5">
              Resultados para: <a href={results.lighthouseResult.requestedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{results.lighthouseResult.requestedUrl}</a>
            </h2>
          )}

          <div className="flex flex-row flex-wrap justify-around gap-5 mb-10">
            {results.lighthouseResult ? 
              renderLighthouseScoresHorizontal(results.lighthouseResult.categories) :
              <p className="w-full text-center text-gray-600">No se encontraron datos de Lighthouse para esta URL.</p> 
            }
          </div>
          
          {/* SECCIÓN DE DIAGNÓSTICOS */}
          {results.lighthouseResult && renderDiagnosticsSection(results.lighthouseResult)}

          {/* Indicador simple para Core Web Vitals */}
          {(results.loadingExperience && results.loadingExperience.metrics && Object.keys(results.loadingExperience.metrics).length > 0) || 
           (results.loadingExperience && (!results.loadingExperience.metrics || Object.keys(results.loadingExperience.metrics).length === 0)) ? (
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