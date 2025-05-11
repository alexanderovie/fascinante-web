// src/app/website-audit/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr"; // Import Phosphor Icons

// --- Interfaces (sin cambios respecto a la versión anterior) ---
interface PageSpeedCategoryScore {
  id: string;
  title: string;
  score: number | null;
  displayValue?: string;
}

interface AuditDetailItem {
  url?: string; 
  node?: { 
    snippet?: string; 
    selector?: string; 
    nodeLabel?: string; 
    path?: string; 
  };
  source?: { 
    type: 'source-location';
    url: string;
    line: number;
    column: number;
  };
  wastedMs?: number; 
  totalBytes?: number; 
  wastedBytes?: number; 
  [key: string]: any; 
}

interface AuditDetails {
  type?: 'table' | 'list' | 'opportunity' | 'filmstrip' | 'screenshot' | 'criticalrequestchain' | string;
  headings?: Array<{ key: string | null; itemType: string; label: string; valueType?: string; subItemsHeading?: { key: string, itemType: string } }>;
  items?: Array<AuditDetailItem>; 
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
}

interface AuditResult {
  id: string;
  title: string;
  description: string; 
  score: number | null;
  scoreDisplayMode?: string; 
  displayValue?: string; 
  details?: AuditDetails;
}

interface AuditRef {
  id: string;
  weight: number;
  group?: string; 
  acronym?: string;
  relevantAudits?: string[];
}

interface LighthouseResult {
  categories: {
    performance: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    accessibility: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    'best-practices': PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    seo: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
  };
  audits: {
    [auditId: string]: AuditResult;
  };
  requestedUrl?: string;
  finalUrl?: string;
  i18n?: { 
    icuMessagePaths?: any;
  };
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
  
  // Estado para controlar qué diagnósticos están expandidos
  const [expandedAuditIds, setExpandedAuditIds] = useState<Record<string, boolean>>({});
  // Estado para controlar cuántos ítems de detalle se muestran por auditoría
  const [visibleDetailItems, setVisibleDetailItems] = useState<Record<string, number>>({});
  const INITIAL_DETAIL_ITEMS_TO_SHOW = 3; // Mostrar 3 ítems de detalle inicialmente

  const toggleAuditExpansion = (auditId: string) => {
    setExpandedAuditIds(prev => ({
      ...prev,
      [auditId]: !prev[auditId]
    }));
  };

  const showMoreDetailItems = (auditId: string, totalItems: number) => {
    setVisibleDetailItems(prev => {
      const currentVisible = prev[auditId] || INITIAL_DETAIL_ITEMS_TO_SHOW;
      return {
        ...prev,
        [auditId]: Math.min(currentVisible + 5, totalItems) // Mostrar 5 más, hasta el total
      };
    });
  };

  const showLessDetailItems = (auditId: string) => {
    setVisibleDetailItems(prev => ({
      ...prev,
      [auditId]: INITIAL_DETAIL_ITEMS_TO_SHOW
    }));
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResults(null);
    setExpandedAuditIds({}); // Resetear acordeones en nueva búsqueda
    setVisibleDetailItems({}); // Resetear items visibles en nueva búsqueda

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
    if (!categoriesData) {
      return <p className="w-full text-center text-gray-600">No se pudieron cargar las categorías de Lighthouse.</p>;
    }
    const scoresToDisplay: (keyof LighthouseResult['categories'])[] = ['performance', 'accessibility', 'best-practices', 'seo'];
    return scoresToDisplay.map(key => {
      const category = categoriesData[key];
      const title = category?.title || key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
      const score = typeof category?.score === 'number' ? Math.round(category.score * 100) : null;
      return (
        <div key={key} className="border border-gray-200 p-5 rounded-lg bg-white text-center flex-1 basis-[200px] min-w-[180px] shadow-md">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-700">{title}</h3>
          {score !== null ? (
            <p className={`text-3xl font-bold mt-1 mb-0 
              ${score >= 90 ? 'text-green-600' : score >= 50 ? 'text-yellow-500' : 'text-red-600'}`}>
              {score}
            </p>
          ) : (
            <p className="text-2xl font-bold mt-1 mb-0 text-gray-500">N/A</p>
          )}
        </div>
      );
    });
  };

  const renderDiagnosticsSection = (lighthouseResult: LighthouseResult | undefined) => {
    if (!lighthouseResult || !lighthouseResult.categories?.performance?.auditRefs || !lighthouseResult.audits) {
      return null;
    }

    const { audits, categories } = lighthouseResult;
    const diagnosticAudits = categories.performance.auditRefs
      .filter(ref => 
        (ref.group === 'diagnostics' || (ref.group !== 'load-opportunities' && ref.group !== 'metrics' && ref.group !== 'budgets')) &&
        audits[ref.id] && 
        (audits[ref.id].score !== null && audits[ref.id].score! < 1) 
      )
      .map(ref => audits[ref.id])
      .filter(audit => audit); 

    if (diagnosticAudits.length === 0) {
      return (
        <div className="mt-8 pt-5 pb-5 border-t border-gray-200 bg-gray-50 rounded-lg">
          <h3 className="text-center text-lg font-semibold text-gray-700 mt-0 mb-3">Diagnósticos Adicionales</h3>
          <p className="text-center text-green-600">¡Buen trabajo! Todas las auditorías de diagnóstico relevantes pasaron o no requieren atención inmediata.</p>
        </div>
      );
    }

    return (
      <div className="mt-8 pt-5 pb-5 border-t border-gray-200 bg-gray-50 rounded-lg px-2 sm:px-4">
        <h3 className="text-center text-lg font-semibold text-gray-700 mt-0 mb-5">Diagnósticos Adicionales</h3>
        <div className="space-y-4">
          {diagnosticAudits.map((audit) => {
            const isExpanded = !!expandedAuditIds[audit.id];
            const currentVisibleItems = visibleDetailItems[audit.id] || INITIAL_DETAIL_ITEMS_TO_SHOW;
            const totalDetailItems = audit.details?.items?.length || 0;

            return (
              <div key={audit.id} className="p-3 sm:p-4 border border-gray-300 rounded-md shadow-sm bg-white">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAuditExpansion(audit.id)}
                  role="button" // Accesibilidad
                  tabIndex={0} // Accesibilidad
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleAuditExpansion(audit.id); }} // Accesibilidad
                  aria-expanded={isExpanded} // Accesibilidad
                  aria-controls={`audit-details-${audit.id}`} // Accesibilidad
                >
                  <h4 className="font-semibold text-gray-800 text-base sm:text-lg">{audit.title}</h4>
                  <span className="text-gray-600">
                    {isExpanded ? <Icon.CaretUp size={20} weight="bold" /> : <Icon.CaretDown size={20} weight="bold" />}
                  </span>
                </div>

                {audit.displayValue && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">{audit.displayValue}</span>
                  </p>
                )}

                {isExpanded && (
                  <div id={`audit-details-${audit.id}`} className="mt-3 pt-3 border-t border-gray-200">
                    <div 
                      className="text-sm text-gray-600 mt-2 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: audit.description }}
                    />
                    
                    {audit.details && audit.details.items && audit.details.items.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Elementos específicos:</p>
                        <ul className="list-none pl-0 space-y-2">
                          {audit.details.items.slice(0, currentVisibleItems).map((item: AuditDetailItem, index: number) => (
                            <li key={index} className="text-xs text-gray-800 bg-gray-100 p-2 rounded break-words">
                              {item.url && (
                                <div className="mb-1"><strong>URL:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-600 hover:underline block truncate">{item.url}</a></div>
                              )}
                              {item.node?.snippet && (
                                <div className="mt-1"><strong>Elemento:</strong> 
                                  <div className="overflow-x-auto bg-gray-200 p-1 rounded max-w-full mt-0.5">
                                    <code className="font-mono text-xs block whitespace-pre">{item.node.snippet}</code>
                                  </div>
                                </div>
                              )}
                              {item.node?.selector && (
                                 <div className="mt-1"><strong>Selector:</strong> <code className="font-mono text-xs bg-gray-200 p-1 rounded">{item.node.selector}</code></div>
                              )}
                              {item.node?.nodeLabel && (
                                 <div className="mt-1"><strong>Etiqueta del Nodo:</strong> {item.node.nodeLabel}</div>
                              )}
                              {typeof item.wastedMs === 'number' && (
                                <div className="mt-1"><strong>Ahorro potencial (tiempo):</strong> {Math.round(item.wastedMs)} ms</div>
                              )}
                              {typeof item.wastedBytes === 'number' && (
                                <div className="mt-1"><strong>Ahorro potencial (tamaño):</strong> {Math.round(item.wastedBytes / 1024)} KB</div>
                              )}
                              {typeof item.totalBytes === 'number' && !item.wastedBytes && (
                                <div className="mt-1"><strong>Tamaño:</strong> {Math.round(item.totalBytes / 1024)} KB</div>
                              )}
                              {Object.keys(item).filter(k => !['url', 'node', 'wastedMs', 'wastedBytes', 'totalBytes', 'sourceLocation'].includes(k)).map(propKey => (
                                  (typeof item[propKey] === 'string' || typeof item[propKey] === 'number') &&
                                  <div key={propKey} className="mt-1"><strong>{propKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}:</strong> {String(item[propKey])}</div>
                              ))}
                            </li>
                          ))}
                        </ul>
                        {totalDetailItems > currentVisibleItems && (
                          <button 
                            onClick={() => showMoreDetailItems(audit.id, totalDetailItems)}
                            className="text-xs text-blue-600 hover:underline mt-2 font-medium"
                          >
                            Mostrar más ({totalDetailItems - currentVisibleItems} restantes)
                          </button>
                        )}
                        {currentVisibleItems > INITIAL_DETAIL_ITEMS_TO_SHOW && (
                           <button 
                              onClick={() => showLessDetailItems(audit.id)}
                              className="text-xs text-blue-600 hover:underline mt-2 ml-2 font-medium"
                          >
                              Mostrar menos
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- JSX del Componente con Encabezado y Pie de Página ---
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo />
          <MenuOne />
        </header>

        <main className="content py-10">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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
                
                {results.lighthouseResult && renderDiagnosticsSection(results.lighthouseResult)}

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
        </main>

        <footer id="footer">
          <Footer />
        </footer>
      </div>
    </>
  );
}
