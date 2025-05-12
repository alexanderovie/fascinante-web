// src/app/website-audit/page.tsx
'use client';

import { useState, FormEvent, Fragment } from 'react';
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";

// --- Interfaces (sin cambios) ---
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
interface SinglePageSpeedResult {
  lighthouseResult?: LighthouseResult;
  loadingExperience?: { 
    metrics: {
      [key: string]: {
        percentile: number;
        category: string; 
        distributions?: Array<{min: number; max?: number; proportion: number}>;
      }
    } | null;
  } | null;
  error?: { 
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
interface CombinedPageSpeedApiResult {
  desktopResult: SinglePageSpeedResult | null; 
  mobileResult: SinglePageSpeedResult | null;  
  error?: string; 
  details?: string;
}

// --- Componente de Página ---
export default function WebsiteAuditPage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<CombinedPageSpeedApiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [expandedAuditIds, setExpandedAuditIds] = useState<Record<string, boolean>>({});
  const [visibleDetailItems, setVisibleDetailItems] = useState<Record<string, number>>({});
  const INITIAL_DETAIL_ITEMS_TO_SHOW = 3;
  
  // Nuevo estado para la pestaña de estrategia activa, por defecto 'mobile'
  const [activeStrategyTab, setActiveStrategyTab] = useState<'mobile' | 'desktop'>('mobile');

  const toggleAuditExpansion = (auditId: string) => { 
    // Añadir la estrategia activa a la clave para que el estado de expansión sea único por estrategia
    const key = `${auditId}-${activeStrategyTab}`;
    setExpandedAuditIds(prev => ({ ...prev, [key]: !prev[key] }));
  }
  const showMoreDetailItems = (auditId: string, totalItems: number) => { 
    const key = `${auditId}-${activeStrategyTab}`;
    setVisibleDetailItems(prev => {
      const currentVisible = prev[key] || INITIAL_DETAIL_ITEMS_TO_SHOW;
      return { ...prev, [key]: Math.min(currentVisible + 5, totalItems) };
    });
  }
  const showLessDetailItems = (auditId: string) => { 
    const key = `${auditId}-${activeStrategyTab}`;
    setVisibleDetailItems(prev => ({ ...prev, [key]: INITIAL_DETAIL_ITEMS_TO_SHOW }));
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResults(null);
    setExpandedAuditIds({});
    setVisibleDetailItems({});
    setActiveStrategyTab('mobile'); // Resetear a mobile en nueva búsqueda

    if (!url) { setError('Por favor, ingresa la URL de un sitio web.'); return; }
    if (!url.startsWith('http://') && !url.startsWith('https://')) { setError('Por favor, ingresa una URL válida (ej. https://example.com)'); return; }

    setIsLoading(true);
    try {
      const response = await fetch('/api/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ url }),
      });
      const data: CombinedPageSpeedApiResult = await response.json();
      if (!response.ok || data.error) { 
        throw new Error(data.error || data.details || `Error al auditar (HTTP ${response.status})`);
      }
      if (data.desktopResult?.error) { console.error("Error de PageSpeed (Desktop):", data.desktopResult.error); }
      if (data.mobileResult?.error) { console.error("Error de PageSpeed (Mobile):", data.mobileResult.error); }
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

  const renderSingleStrategyScores = (strategyResult: SinglePageSpeedResult | null | undefined, strategyName: string) => {
    // ... (sin cambios en la lógica interna, solo se llamará una vez con la estrategia activa)
    if (!strategyResult || !strategyResult.lighthouseResult?.categories) {
      return <p className="w-full text-center text-gray-500 py-4">No hay datos de Lighthouse para {strategyName}.</p>;
    }
    const categoriesData = strategyResult.lighthouseResult.categories;
    return (
      <div className="mb-8">
        {/* El título de la estrategia (Desktop/Mobile) se manejará por las pestañas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['performance', 'accessibility', 'best-practices', 'seo'].map(key => {
            const category = categoriesData[key as keyof LighthouseResult['categories']];
            const title = category?.title || key.charAt(0).toUpperCase() + key.slice(1);
            const score = typeof category?.score === 'number' ? Math.round(category.score * 100) : null;
            let scoreColorClass = 'text-grey';
            if (score !== null) {
              if (score >= 90) scoreColorClass = 'text-success';
              else if (score >= 50) scoreColorClass = 'text-yellow';
              else scoreColorClass = 'text-critical';
            }
            return (
              <div key={`${strategyName}-${key}`} className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg bg-white shadow-md aspect-square">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 flex items-center justify-center mb-2 ${score !== null ? (score >= 90 ? 'border-success' : score >= 50 ? 'border-yellow' : 'border-critical') : 'border-grey'}`}>
                  <span className={`text-2xl sm:text-3xl font-bold ${scoreColorClass}`}>{score !== null ? score : 'N/A'}</span>
                </div>
                <h4 className="mt-1 text-xs sm:text-sm font-semibold text-gray-700 text-center">{title}</h4>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderCoreWebVitals = (strategyResult: SinglePageSpeedResult | null | undefined, strategyName: string) => {
    // ... (sin cambios en la lógica interna, solo se llamará una vez con la estrategia activa)
    if (!strategyResult?.loadingExperience?.metrics) {
      return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow">
          <p className="text-sm text-secondary">No hay datos de Core Web Vitals (datos de campo) disponibles para {strategyName}.</p>
        </div>
      );
    }
    const metrics = strategyResult.loadingExperience.metrics;
    const vitalsToShow = [
      { key: 'LARGEST_CONTENTFUL_PAINT_MS', label: 'LCP' },
      { key: 'INTERACTION_TO_NEXT_PAINT', label: 'INP' },
      { key: 'CUMULATIVE_LAYOUT_SHIFT_SCORE', label: 'CLS' },
    ];
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow">
        {/* El título de la estrategia se manejará por las pestañas */}
        <div className="space-y-3">
          {vitalsToShow.map(vital => {
            const metricData = metrics[vital.key];
            if (!metricData || !metricData.distributions) return ( <div key={vital.key} className="text-sm"><span className="font-medium">{vital.label}:</span> <span className="text-secondary">N/D</span></div> );
            const good = metricData.distributions.find(d => d.min === 0)?.proportion || 0;
            const needsImprovement = metricData.distributions.find(d => d.min !== 0 && d.max !== undefined)?.proportion || 0;
            const poor = metricData.distributions.find(d => d.min !== 0 && d.max === undefined)?.proportion || 0;
            let overallCategory = metricData.category;
            let categoryColorClass = 'bg-surface text-secondary';
            if (overallCategory === 'GOOD' || overallCategory === 'FAST') categoryColorClass = 'bg-success/20 text-success';
            else if (overallCategory === 'NEEDS_IMPROVEMENT' || overallCategory === 'AVERAGE') categoryColorClass = 'bg-yellow/20 text-yellow';
            else if (overallCategory === 'POOR' || overallCategory === 'SLOW') categoryColorClass = 'bg-critical/20 text-critical';

            return (
              <div key={vital.key}>
                <div className="flex justify-between items-center text-sm mb-0.5">
                  <span className="font-medium text-secondary">{vital.label}:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColorClass}`}>
                    {metricData.percentile} {vital.key.includes('MS') ? 'ms' : ''} ({overallCategory?.replace('_', ' ') || 'N/A'})
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                  <div style={{ width: `${good * 100}%` }} className="bg-success"></div>
                  <div style={{ width: `${needsImprovement * 100}%` }} className="bg-yellow"></div>
                  <div style={{ width: `${poor * 100}%` }} className="bg-critical"></div>
                </div>
                 <div className="flex justify-between text-xs text-secondary mt-0.5">
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
    // ... (La lógica interna de esta función no cambia, pero ahora recibe el resultado de la estrategia activa)
    if (!singleStrategyResult || !singleStrategyResult.lighthouseResult || !singleStrategyResult.lighthouseResult.categories?.performance?.auditRefs || !singleStrategyResult.lighthouseResult.audits) {
      return <p className="text-center text-secondary mt-4">No hay datos de diagnóstico disponibles para la estrategia seleccionada.</p>;
    }
    const { audits, categories } = singleStrategyResult.lighthouseResult;
    const diagnosticAudits = categories.performance.auditRefs
      .filter(ref => (ref.group === 'diagnostics' || (ref.group !== 'load-opportunities' && ref.group !== 'metrics' && ref.group !== 'budgets')) && audits[ref.id] && (audits[ref.id].score !== null && audits[ref.id].score! < 1) )
      .map(ref => audits[ref.id])
      .filter(audit => audit); 
    if (diagnosticAudits.length === 0) { 
        return ( <div className="mt-8 pt-5 pb-5 border-t border-line bg-surface rounded-lg">
              <h3 className="text-center text-lg font-semibold text-black mt-0 mb-3">Diagnósticos Adicionales</h3>
              <p className="text-center text-success">¡Buen trabajo! Todas las auditorías de diagnóstico relevantes pasaron.</p>
            </div> );
    }
    return (
        <div className="mt-8 pt-5 pb-5 border-t border-line bg-surface rounded-lg px-2 sm:px-4">
          <h3 className="text-center text-lg font-semibold text-black mt-0 mb-5">Diagnósticos Adicionales</h3>
          <div className="space-y-4">
            {diagnosticAudits.map((audit) => {
              const keyForExpansion = `${audit.id}-${activeStrategyTab}`; // Usar activeStrategyTab para la clave
              const isExpanded = !!expandedAuditIds[keyForExpansion];
              const currentVisibleItems = visibleDetailItems[keyForExpansion] || INITIAL_DETAIL_ITEMS_TO_SHOW;
              const totalDetailItems = audit.details?.items?.length || 0;
              return (
                <div key={keyForExpansion} className="p-3 sm:p-4 border border-line rounded-md shadow-sm bg-white">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleAuditExpansion(keyForExpansion)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleAuditExpansion(keyForExpansion); }} aria-expanded={isExpanded} aria-controls={`audit-details-${keyForExpansion}`}>
                    <h4 className="font-semibold text-black text-base sm:text-lg">{audit.title}</h4>
                    <span className="text-secondary"><Icon.CaretDown size={20} weight="bold" className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} /></span>
                  </div>
                  {audit.displayValue && (<p className="text-sm text-secondary mt-1"><span className="font-medium">{audit.displayValue}</span></p>)}
                  {isExpanded && (
                    <div id={`audit-details-${keyForExpansion}`} className="mt-3 pt-3 border-t border-line">
                      <div className="text-sm text-secondary mt-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: audit.description }} />
                      {audit.details && audit.details.items && audit.details.items.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-line">
                          <p className="text-xs font-semibold text-grey mb-2">Elementos específicos:</p>
                          <ul className="list-none pl-0 space-y-2">
                            {audit.details.items.slice(0, currentVisibleItems).map((item: AuditDetailItem, index: number) => (
                              <li key={index} className="text-xs text-black bg-surface p-2 rounded break-words">
                                {item.url && (<div className="mb-1"><strong>URL:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-mono text-blue hover:underline block truncate">{item.url}</a></div>)}
                                {item.node?.snippet && (<div className="mt-1"><strong>Elemento:</strong> <div className="overflow-x-auto bg-gray-200 p-1 rounded max-w-full mt-0.5"><code className="font-mono text-xs block whitespace-pre">{item.node.snippet}</code></div></div>)}
                                {item.node?.selector && (<div className="mt-1"><strong>Selector:</strong> <code className="font-mono text-xs bg-gray-200 p-1 rounded">{item.node.selector}</code></div>)}
                                {item.node?.nodeLabel && (<div className="mt-1"><strong>Etiqueta del Nodo:</strong> {item.node.nodeLabel}</div>)}
                                {typeof item.wastedMs === 'number' && (<div className="mt-1"><strong>Ahorro potencial (tiempo):</strong> {Math.round(item.wastedMs)} ms</div>)}
                                {typeof item.wastedBytes === 'number' && (<div className="mt-1"><strong>Ahorro potencial (tamaño):</strong> {Math.round(item.wastedBytes / 1024)} KB</div>)}
                                {typeof item.totalBytes === 'number' && !item.wastedBytes && (<div className="mt-1"><strong>Tamaño:</strong> {Math.round(item.totalBytes / 1024)} KB</div>)}
                                {Object.keys(item).filter(k => !['url', 'node', 'wastedMs', 'wastedBytes', 'totalBytes', 'sourceLocation'].includes(k)).map(propKey => ( (typeof item[propKey] === 'string' || typeof item[propKey] === 'number') && <div key={propKey} className="mt-1"><strong>{propKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}:</strong> {String(item[propKey])}</div> ))}
                              </li>
                            ))}
                          </ul>
                          {totalDetailItems > currentVisibleItems && (<button onClick={() => showMoreDetailItems(keyForExpansion, totalDetailItems)} className="text-xs text-blue hover:underline mt-2 font-medium">Mostrar más ({totalDetailItems - currentVisibleItems} restantes)</button>)}
                          {currentVisibleItems > INITIAL_DETAIL_ITEMS_TO_SHOW && (<button onClick={() => showLessDetailItems(keyForExpansion)} className="text-xs text-blue hover:underline mt-2 ml-2 font-medium">Mostrar menos</button>)}
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

  // Determinar qué conjunto de resultados mostrar basado en la pestaña activa
  const activeStrategyResult = activeStrategyTab === 'mobile' ? results?.mobileResult : results?.desktopResult;

  // --- JSX del Componente ---
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header"><TopNavTwo /><MenuOne /></header>
        <main className="content py-10">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black">Auditoría Web Avanzada</h1>
              <p className="text-md text-secondary mt-2">Resultados de PageSpeed Insights.</p>
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 mb-10">
              <input type="url" value={url} onChange={(e) => { setUrl(e.target.value); setError(null); }} placeholder="https://ejemplo.com" required className="flex-grow w-full sm:w-auto bg-surface text-secondary caption1 px-4 py-3 rounded-lg border border-line focus:ring-2 focus:ring-blue focus:border-transparent"/>
              <button type="submit" disabled={isLoading} className={`button-main text-white text-button rounded-full px-6 py-3 w-full sm:w-auto transition-colors duration-150 ease-in-out whitespace-nowrap ${isLoading ? 'bg-grey hover:bg-grey cursor-not-allowed' : 'bg-blue hover:bg-dark-blue'}`}>
                {isLoading ? 'Auditando...' : 'Auditar Sitio'}
              </button>
            </form>

            {isLoading && <p className="text-center text-lg text-secondary my-5">Cargando resultados (esto puede tardar un poco más al obtener datos de desktop y mobile)...</p>}
            {error && <p className="text-center text-critical bg-critical/10 border border-critical/30 p-3 rounded-md my-5">Error: {error}</p>}

            {results && !error && (
              <div>
                {/* Pestañas para seleccionar Mobile/Desktop */}
                <div className="flex justify-center mb-6 border-b border-line">
                  <button 
                    onClick={() => setActiveStrategyTab('mobile')}
                    className={`px-4 sm:px-6 py-3 text-sm font-medium -mb-px border-b-2 transition-colors
                                ${activeStrategyTab === 'mobile' ? 'border-blue text-blue' : 'border-transparent text-secondary hover:text-black hover:border-gray-300'}`}
                  >
                    Mobile
                  </button>
                  <button 
                    onClick={() => setActiveStrategyTab('desktop')}
                    className={`px-4 sm:px-6 py-3 text-sm font-medium -mb-px border-b-2 transition-colors
                                ${activeStrategyTab === 'desktop' ? 'border-blue text-blue' : 'border-transparent text-secondary hover:text-black hover:border-gray-300'}`}
                  >
                    Desktop
                  </button>
                </div>

                {/* Título de la estrategia activa */}
                <h2 className="text-2xl font-semibold text-black mb-6 text-center">
                  Resultados para {activeStrategyTab.charAt(0).toUpperCase() + activeStrategyTab.slice(1)}
                </h2>

                {/* Mostrar resultados de la estrategia activa */}
                {activeStrategyResult && activeStrategyResult.lighthouseResult ? (
                  <>
                    {results.lighthouseResult && results.lighthouseResult.requestedUrl && ( // Muestra la URL analizada una vez
                        <p className="text-center text-sm text-secondary mb-6">
                            Analizando: <a href={activeStrategyResult.lighthouseResult.requestedUrl} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">{activeStrategyResult.lighthouseResult.requestedUrl}</a>
                        </p>
                    )}
                    {renderSingleStrategyScores(activeStrategyResult, activeStrategyTab.charAt(0).toUpperCase() + activeStrategyTab.slice(1))}
                    
                    {activeStrategyResult.loadingExperience && (
                        <div className="my-10">
                            <h3 className="text-xl font-semibold text-black mb-4 text-center">Core Web Vitals (Datos de Campo)</h3>
                            {renderCoreWebVitals(activeStrategyResult, activeStrategyTab.charAt(0).toUpperCase() + activeStrategyTab.slice(1))}
                        </div>
                    )}

                    {renderDiagnosticsSection(activeStrategyResult)}
                  </>
                ) : (
                  <p className="text-center text-secondary my-10">
                    No hay datos disponibles para la vista {activeStrategyTab}. 
                    {activeStrategyTab === 'mobile' && results?.mobileResult?.error ? `Error: ${results.mobileResult.error.message}` : ''}
                    {activeStrategyTab === 'desktop' && results?.desktopResult?.error ? `Error: ${results.desktopResult.error.message}` : ''}
                  </p>
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
