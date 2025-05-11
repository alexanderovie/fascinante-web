// src/app/website-audit/page.tsx
'use client';

import { useState, FormEvent, Fragment } from 'react'; // Fragment añadido
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";

// --- Interfaces Actualizadas ---
interface PageSpeedCategoryScore {
  id: string;
  title: string;
  score: number | null;
  displayValue?: string;
}

interface AuditDetailItem {
  url?: string; 
  node?: { snippet?: string; selector?: string; nodeLabel?: string; path?: string; };
  source?: { type: 'source-location'; url: string; line: number; column: number; };
  wastedMs?: number; 
  totalBytes?: number; 
  wastedBytes?: number; 
  [key: string]: any; 
}

interface AuditDetails {
  type?: string;
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

// Representa el resultado de una única ejecución de PageSpeed (para una estrategia)
interface SinglePageSpeedResult {
  lighthouseResult?: LighthouseResult;
  loadingExperience?: { // Core Web Vitals (Datos de campo)
    metrics: {
      [key: string]: {
        percentile: number;
        category: string; // Ejemplo: 'FAST', 'AVERAGE', 'SLOW'
        // La API también devuelve 'distributions' que usaremos para las barras
        distributions?: Array<{min: number; max?: number; proportion: number}>;
      }
    } | null;
  } | null;
  error?: { // Errores específicos de esta ejecución de PageSpeed
    code: number;
    message: string;
    errors: Array<{ message: string; domain: string; reason: string }>;
  };
}

interface LighthouseResult {
  categories: {
    performance: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    accessibility: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    'best-practices': PageSpeedCategoryScore & { auditRefs: AuditRef[] };
    seo: PageSpeedCategoryScore & { auditRefs: AuditRef[] };
  };
  audits: { [auditId: string]: AuditResult; };
  requestedUrl?: string;
  finalUrl?: string;
  i18n?: { icuMessagePaths?: any; };
}

// Nueva interfaz para la respuesta combinada del backend
interface CombinedPageSpeedApiResult {
  desktopResult: SinglePageSpeedResult | null; // Puede ser null si falló esa solicitud
  mobileResult: SinglePageSpeedResult | null;  // Puede ser null si falló esa solicitud
  error?: string; // Para errores generales del backend antes de las llamadas a PSI
  details?: string;
}

// --- Componente de Página ---
export default function WebsiteAuditPage() {
  const [url, setUrl] = useState('');
  // El estado 'results' ahora usará CombinedPageSpeedApiResult
  const [results, setResults] = useState<CombinedPageSpeedApiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [expandedAuditIds, setExpandedAuditIds] = useState<Record<string, boolean>>({});
  const [visibleDetailItems, setVisibleDetailItems] = useState<Record<string, number>>({});
  const INITIAL_DETAIL_ITEMS_TO_SHOW = 3;
  // Estado para la estrategia seleccionada para ver diagnósticos (o un valor por defecto)
  const [selectedStrategyForDiagnostics, setSelectedStrategyForDiagnostics] = useState<'desktop' | 'mobile'>('desktop');


  const toggleAuditExpansion = (auditId: string) => { /* ... (sin cambios) ... */ 
    setExpandedAuditIds(prev => ({ ...prev, [auditId]: !prev[auditId] }));
  }
  const showMoreDetailItems = (auditId: string, totalItems: number) => { /* ... (sin cambios) ... */ 
    setVisibleDetailItems(prev => {
      const currentVisible = prev[auditId] || INITIAL_DETAIL_ITEMS_TO_SHOW;
      return { ...prev, [auditId]: Math.min(currentVisible + 5, totalItems) };
    });
  }
  const showLessDetailItems = (auditId: string) => { /* ... (sin cambios) ... */ 
    setVisibleDetailItems(prev => ({ ...prev, [auditId]: INITIAL_DETAIL_ITEMS_TO_SHOW }));
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResults(null);
    setExpandedAuditIds({});
    setVisibleDetailItems({});

    if (!url) { /* ... (sin cambios) ... */ setError('Por favor, ingresa la URL de un sitio web.'); return; }
    if (!url.startsWith('http://') && !url.startsWith('https://')) { /* ... (sin cambios) ... */ setError('Por favor, ingresa una URL válida (ej. https://example.com)'); return; }

    setIsLoading(true);

    try {
      const response = await fetch('/api/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ url }),
      });

      // La respuesta ahora es CombinedPageSpeedApiResult
      const data: CombinedPageSpeedApiResult = await response.json();

      if (!response.ok || data.error) { // Si la respuesta del backend indica un error general
        throw new Error(data.error || data.details || `Error al auditar (HTTP ${response.status})`);
      }
      
      // Comprobar si alguno de los resultados individuales tiene un error de la API de PSI
      if (data.desktopResult?.error) {
        console.error("Error de PageSpeed (Desktop):", data.desktopResult.error);
        // Podrías mostrar un error parcial o manejarlo como prefieras
      }
      if (data.mobileResult?.error) {
        console.error("Error de PageSpeed (Mobile):", data.mobileResult.error);
      }

      // Si no hay lighthouseResult en ninguno de los dos, es un problema más general
      if (!data.desktopResult?.lighthouseResult && !data.mobileResult?.lighthouseResult) {
        setError('No se encontraron resultados de Lighthouse para esta URL. Puede que no sea pública o auditable.');
        console.warn("Respuesta de PageSpeed sin lighthouseResult para ambas estrategias:", data);
      } else {
        setResults(data);
      }

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderiza las puntuaciones para UNA estrategia (desktop o mobile)
  const renderSingleStrategyScores = (strategyResult: SinglePageSpeedResult | null | undefined, strategyName: string) => {
    if (!strategyResult || !strategyResult.lighthouseResult?.categories) {
      return <p className="w-full text-center text-gray-500 py-4">No hay datos de Lighthouse para {strategyName}.</p>;
    }
    const categoriesData = strategyResult.lighthouseResult.categories;
    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-3 text-center sm:text-left">{strategyName}</h3>
        <div className="flex flex-row flex-wrap justify-around gap-4">
          {['performance', 'accessibility', 'best-practices', 'seo'].map(key => {
            const category = categoriesData[key as keyof LighthouseResult['categories']];
            const title = category?.title || key.charAt(0).toUpperCase() + key.slice(1);
            const score = typeof category?.score === 'number' ? Math.round(category.score * 100) : null;
            return (
              <div key={`${strategyName}-${key}`} className="border border-gray-200 p-4 rounded-lg bg-white text-center flex-1 basis-[180px] min-w-[150px] shadow-md">
                <h4 className="mt-0 mb-1 text-md font-semibold text-gray-700">{title}</h4>
                {score !== null ? (
                  <p className={`text-3xl font-bold mt-1 mb-0 ${score >= 90 ? 'text-green-600' : score >= 50 ? 'text-yellow-500' : 'text-red-600'}`}>{score}</p>
                ) : (
                  <p className="text-2xl font-bold mt-1 mb-0 text-gray-500">N/A</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // NUEVA FUNCIÓN para renderizar Core Web Vitals como en la imagen
  const renderCoreWebVitals = (strategyResult: SinglePageSpeedResult | null | undefined, strategyName: string) => {
    if (!strategyResult?.loadingExperience?.metrics) {
      return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow">
          <h4 className="font-semibold text-gray-700 mb-1">{strategyName}</h4>
          <p className="text-sm text-gray-500">No hay datos de Core Web Vitals (datos de campo) disponibles.</p>
        </div>
      );
    }
    const metrics = strategyResult.loadingExperience.metrics;
    const vitalsToShow = [
      { key: 'LARGEST_CONTENTFUL_PAINT_MS', label: 'LCP' },
      { key: 'INTERACTION_TO_NEXT_PAINT', label: 'INP' }, // O 'FIRST_INPUT_DELAY_MS' si INP no está
      { key: 'CUMULATIVE_LAYOUT_SHIFT_SCORE', label: 'CLS' },
    ];

    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow">
        <h4 className="font-semibold text-gray-700 mb-3">{strategyName}</h4>
        {/* Aquí podrías añadir el tag "Needs improvement" si lo calculas */}
        <div className="space-y-3">
          {vitalsToShow.map(vital => {
            const metricData = metrics[vital.key];
            if (!metricData || !metricData.distributions) return (
                <div key={vital.key} className="text-sm">
                    <span className="font-medium">{vital.label}:</span> <span className="text-gray-500">N/D</span>
                </div>
            );

            const good = metricData.distributions.find(d => d.min === 0)?.proportion || 0;
            const needsImprovement = metricData.distributions.find(d => d.min !== 0 && d.max !== undefined)?.proportion || 0; // Simplificación
            const poor = metricData.distributions.find(d => d.min !== 0 && d.max === undefined)?.proportion || 0; // Simplificación

            // Ajuste para asegurar que la suma no exceda 1 (puede haber pequeños errores de redondeo)
            // Esta es una lógica simplificada, la API de PSI es más precisa en cómo define los rangos 'good', 'needs improvement', 'poor'
            // para cada métrica. Deberías consultar la documentación para los umbrales exactos.
            // Por ahora, usaremos los colores basados en la categoría general de la métrica si está disponible.
            let overallCategory = metricData.category; // 'FAST', 'AVERAGE', 'SLOW' o 'GOOD', 'NEEDS_IMPROVEMENT', 'POOR'

            return (
              <div key={vital.key}>
                <div className="flex justify-between items-center text-sm mb-0.5">
                  <span className="font-medium">{vital.label}:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${overallCategory === 'GOOD' || overallCategory === 'FAST' ? 'bg-green-100 text-green-700' : 
                      overallCategory === 'NEEDS_IMPROVEMENT' || overallCategory === 'AVERAGE' ? 'bg-yellow-100 text-yellow-700' : 
                      overallCategory === 'POOR' || overallCategory === 'SLOW' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {metricData.percentile} {vital.key.includes('MS') ? 'ms' : ''} ({overallCategory?.replace('_', ' ') || 'N/A'})
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                  <div style={{ width: `${good * 100}%` }} className="bg-green-500"></div>
                  <div style={{ width: `${needsImprovement * 100}%` }} className="bg-yellow-400"></div>
                  <div style={{ width: `${poor * 100}%` }} className="bg-red-500"></div>
                </div>
                 <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                    <span>{Math.round(good * 100)}%</span>
                    <span>{Math.round(needsImprovement * 100)}%</span>
                    <span>{Math.round(poor * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDiagnosticsSection = (singleStrategyResult: SinglePageSpeedResult | null | undefined) => {
    // ... (la lógica de renderDiagnosticsSection se mantiene, pero ahora opera sobre un SinglePageSpeedResult)
    // Asegúrate de pasar results?.desktopResult o results?.mobileResult a esta función
    if (!singleStrategyResult || !singleStrategyResult.lighthouseResult || !singleStrategyResult.lighthouseResult.categories?.performance?.auditRefs || !singleStrategyResult.lighthouseResult.audits) {
      return <p className="text-center text-gray-500 mt-4">No hay datos de diagnóstico disponibles para la estrategia seleccionada.</p>;
    }
    const { audits, categories } = singleStrategyResult.lighthouseResult;
    // ... (resto de la lógica de filtrado y mapeo de diagnosticAudits igual que antes) ...
    const diagnosticAudits = categories.performance.auditRefs
      .filter(ref => 
        (ref.group === 'diagnostics' || (ref.group !== 'load-opportunities' && ref.group !== 'metrics' && ref.group !== 'budgets')) &&
        audits[ref.id] && 
        (audits[ref.id].score !== null && audits[ref.id].score! < 1) 
      )
      .map(ref => audits[ref.id])
      .filter(audit => audit); 

    if (diagnosticAudits.length === 0) { /* ... (igual que antes) ... */ 
        return (
            <div className="mt-8 pt-5 pb-5 border-t border-gray-200 bg-gray-50 rounded-lg">
              <h3 className="text-center text-lg font-semibold text-gray-700 mt-0 mb-3">Diagnósticos Adicionales</h3>
              <p className="text-center text-green-600">¡Buen trabajo! Todas las auditorías de diagnóstico relevantes pasaron o no requieren atención inmediata.</p>
            </div>
          );
    }
    // ... (resto del JSX de renderDiagnosticsSection igual que antes, usando 'audit' de diagnosticAudits) ...
    return (
        <div className="mt-8 pt-5 pb-5 border-t border-gray-200 bg-gray-50 rounded-lg px-2 sm:px-4">
          <h3 className="text-center text-lg font-semibold text-gray-700 mt-0 mb-5">
            Diagnósticos Adicionales ({selectedStrategyForDiagnostics.charAt(0).toUpperCase() + selectedStrategyForDiagnostics.slice(1)})
          </h3>
          <div className="space-y-4">
            {diagnosticAudits.map((audit) => {
              const isExpanded = !!expandedAuditIds[audit.id + selectedStrategyForDiagnostics]; // Clave única por estrategia
              const currentVisibleItems = visibleDetailItems[audit.id + selectedStrategyForDiagnostics] || INITIAL_DETAIL_ITEMS_TO_SHOW;
              const totalDetailItems = audit.details?.items?.length || 0;
  
              return (
                <div key={audit.id + selectedStrategyForDiagnostics} className="p-3 sm:p-4 border border-gray-300 rounded-md shadow-sm bg-white">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleAuditExpansion(audit.id + selectedStrategyForDiagnostics)}
                    role="button" tabIndex={0} 
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleAuditExpansion(audit.id + selectedStrategyForDiagnostics); }}
                    aria-expanded={isExpanded} aria-controls={`audit-details-${audit.id + selectedStrategyForDiagnostics}`}
                  >
                    <h4 className="font-semibold text-gray-800 text-base sm:text-lg">{audit.title}</h4>
                    <span className="text-gray-600">
                      {isExpanded ? <Icon.CaretUp size={20} weight="bold" /> : <Icon.CaretDown size={20} weight="bold" />}
                    </span>
                  </div>
                  {audit.displayValue && (<p className="text-sm text-gray-700 mt-1"><span className="font-medium">{audit.displayValue}</span></p>)}
                  {isExpanded && (
                    <div id={`audit-details-${audit.id + selectedStrategyForDiagnostics}`} className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mt-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: audit.description }} />
                      {audit.details && audit.details.items && audit.details.items.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Elementos específicos:</p>
                          <ul className="list-none pl-0 space-y-2">
                            {audit.details.items.slice(0, currentVisibleItems).map((item: AuditDetailItem, index: number) => (
                              <li key={index} className="text-xs text-gray-800 bg-gray-100 p-2 rounded break-words">
                                {item.url && (<div className="mb-1"><strong>URL:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-600 hover:underline block truncate">{item.url}</a></div>)}
                                {item.node?.snippet && (<div className="mt-1"><strong>Elemento:</strong> <div className="overflow-x-auto bg-gray-200 p-1 rounded max-w-full mt-0.5"><code className="font-mono text-xs block whitespace-pre">{item.node.snippet}</code></div></div>)}
                                {item.node?.selector && (<div className="mt-1"><strong>Selector:</strong> <code className="font-mono text-xs bg-gray-200 p-1 rounded">{item.node.selector}</code></div>)}
                                {item.node?.nodeLabel && (<div className="mt-1"><strong>Etiqueta del Nodo:</strong> {item.node.nodeLabel}</div>)}
                                {typeof item.wastedMs === 'number' && (<div className="mt-1"><strong>Ahorro potencial (tiempo):</strong> {Math.round(item.wastedMs)} ms</div>)}
                                {typeof item.wastedBytes === 'number' && (<div className="mt-1"><strong>Ahorro potencial (tamaño):</strong> {Math.round(item.wastedBytes / 1024)} KB</div>)}
                                {typeof item.totalBytes === 'number' && !item.wastedBytes && (<div className="mt-1"><strong>Tamaño:</strong> {Math.round(item.totalBytes / 1024)} KB</div>)}
                                {Object.keys(item).filter(k => !['url', 'node', 'wastedMs', 'wastedBytes', 'totalBytes', 'sourceLocation'].includes(k)).map(propKey => (
                                    (typeof item[propKey] === 'string' || typeof item[propKey] === 'number') &&
                                    <div key={propKey} className="mt-1"><strong>{propKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}:</strong> {String(item[propKey])}</div>
                                ))}
                              </li>
                            ))}
                          </ul>
                          {totalDetailItems > currentVisibleItems && (<button onClick={() => showMoreDetailItems(audit.id + selectedStrategyForDiagnostics, totalDetailItems)} className="text-xs text-blue-600 hover:underline mt-2 font-medium">Mostrar más ({totalDetailItems - currentVisibleItems} restantes)</button>)}
                          {currentVisibleItems > INITIAL_DETAIL_ITEMS_TO_SHOW && (<button onClick={() => showLessDetailItems(audit.id + selectedStrategyForDiagnostics)} className="text-xs text-blue-600 hover:underline mt-2 ml-2 font-medium">Mostrar menos</button>)}
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


  // --- JSX del Componente ---
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header"><TopNavTwo /><MenuOne /></header>
        <main className="content py-10">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"> {/* Aumentado max-w para más espacio */}
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Auditoría Web Avanzada</h1>
              <p className="text-md text-gray-600 mt-2">Resultados de PageSpeed Insights para Desktop y Mobile.</p>
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 mb-10">
              <input type="url" value={url} onChange={(e) => { setUrl(e.target.value); setError(null); }} placeholder="https://ejemplo.com" required className="flex-grow w-full sm:w-auto bg-surface text-secondary caption1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
              <button type="submit" disabled={isLoading} className={`button-main text-white text-button rounded-full px-6 py-3 w-full sm:w-auto transition-colors duration-150 ease-in-out whitespace-nowrap ${isLoading ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'bg-blue hover:bg-blue-600'}`}>
                {isLoading ? 'Auditando...' : 'Auditar Sitio'}
              </button>
            </form>

            {isLoading && <p className="text-center text-lg text-gray-600 my-5">Cargando resultados (esto puede tardar un poco más al obtener datos de desktop y mobile)...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 border border-red-300 p-3 rounded-md my-5">Error: {error}</p>}

            {results && !error && (
              <div>
                {/* Sección de Puntuaciones Generales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div>{renderSingleStrategyScores(results.desktopResult, 'Desktop')}</div>
                    <div>{renderSingleStrategyScores(results.mobileResult, 'Mobile')}</div>
                </div>

                {/* Sección de Core Web Vitals */}
                {(results.desktopResult?.loadingExperience || results.mobileResult?.loadingExperience) && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Core Web Vitals (Datos de Campo)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderCoreWebVitals(results.desktopResult, 'Desktop')}
                            {renderCoreWebVitals(results.mobileResult, 'Mobile')}
                        </div>
                    </div>
                )}
                
                {/* Sección de Diagnósticos con Selector */}
                {(results.desktopResult?.lighthouseResult || results.mobileResult?.lighthouseResult) && (
                    <div className="my-10">
                        <div className="flex justify-center mb-4">
                            <button 
                                onClick={() => setSelectedStrategyForDiagnostics('desktop')}
                                className={`px-4 py-2 rounded-l-md border ${selectedStrategyForDiagnostics === 'desktop' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-gray-300 hover:bg-gray-50'}`}
                            >
                                Diagnósticos Desktop
                            </button>
                            <button 
                                onClick={() => setSelectedStrategyForDiagnostics('mobile')}
                                className={`px-4 py-2 rounded-r-md border-t border-b border-r ${selectedStrategyForDiagnostics === 'mobile' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-gray-300 hover:bg-gray-50'}`}
                            >
                                Diagnósticos Mobile
                            </button>
                        </div>
                        {selectedStrategyForDiagnostics === 'desktop' && renderDiagnosticsSection(results.desktopResult)}
                        {selectedStrategyForDiagnostics === 'mobile' && renderDiagnosticsSection(results.mobileResult)}
                    </div>
                )}
              </div>
            )}
          </div>
        </main>
        <footer id="footer"><Footer /></footer>
      </div>
    </>
  );
}
