// src/app/website-audit/page.tsx
'use client';

import { useState, FormEvent, Fragment } from 'react'; // Fragment no se usa, se podría quitar
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";

// --- Interfaces (sin cambios) ---
// ... (tus interfaces aquí)
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


// --- Componente de Esqueleto (AuditSkeletonLoader) ---
// (Pega el código del AuditSkeletonLoader aquí o impórtalo si lo pusiste en otro archivo)
const AuditSkeletonLoader = () => {
  return (
    <div className="animate-pulse mt-8"> {/* Añade una animación de pulso simple de Tailwind y margen superior */}
      {/* Esqueleto para los Tabs Mobile/Desktop */}
      <div className="flex justify-center mb-6 border-b border-gray-300 dark:border-gray-700">
        <div className="px-4 sm:px-6 py-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        <div className="px-4 sm:px-6 py-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
      </div>

      {/* Esqueleto para el título de la estrategia */}
      <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mx-auto mb-6 sm:mb-8"></div>

      {/* Esqueleto para la URL analizada */}
      {/* <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mx-auto mb-6 sm:mb-8"></div> */}


      {/* Esqueleto para los círculos de puntuación */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md aspect-square"> {/* Ajuste dark mode bg */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-400 dark:bg-gray-700 flex items-center justify-center mb-2">
              </div>
              <div className="h-3.5 bg-gray-400 dark:bg-gray-700 rounded w-3/4 mt-1"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Esqueleto para Core Web Vitals */}
      <div className="my-10 sm:my-12">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-4 sm:mb-6"></div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow space-y-5"> {/* Ajuste dark mode bg */}
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-1/5"></div>
              </div>
              <div className="h-2 bg-gray-400 dark:bg-gray-700 rounded-full"></div>
              <div className="flex justify-between text-xs text-transparent mt-0.5">
                  <span className="bg-gray-400 dark:bg-gray-700 rounded w-1/6 h-3 block"></span>
                  <span className="bg-gray-400 dark:bg-gray-700 rounded w-1/6 h-3 block"></span>
                  <span className="bg-gray-400 dark:bg-gray-700 rounded w-1/6 h-3 block"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Esqueleto para Diagnósticos */}
      <div className="mt-8 pt-5 pb-5 border-t border-gray-300 dark:border-gray-700 rounded-lg px-2 sm:px-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-5"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800"> {/* Ajuste dark mode bg */}
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-400 dark:bg-gray-700 rounded w-3/5"></div>
                <div className="h-5 w-5 bg-gray-400 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-3 bg-gray-400 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- Componente de Página ---
export default function WebsiteAuditPage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<CombinedPageSpeedApiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true); // Nuevo estado para controlar la visibilidad de la intro

  // ... (resto de tus estados y funciones: expandedAuditIds, toggleAuditExpansion, handleSubmit, etc. SIN CAMBIOS)
  const [expandedAuditIds, setExpandedAuditIds] = useState<Record<string, boolean>>({});
  const [visibleDetailItems, setVisibleDetailItems] = useState<Record<string, number>>({});
  const INITIAL_DETAIL_ITEMS_TO_SHOW = 3;

  const [activeStrategyTab, setActiveStrategyTab] = useState<'mobile' | 'desktop'>('mobile');

  const toggleAuditExpansion = (keyToToggle: string) => {
    setExpandedAuditIds(prev => ({ ...prev, [keyToToggle]: !prev[keyToToggle] }));
  }
  const showMoreDetailItems = (keyForItems: string, totalItems: number) => {
    setVisibleDetailItems(prev => ({
      ...prev,
      [keyForItems]: Math.min((prev[keyForItems] || INITIAL_DETAIL_ITEMS_TO_SHOW) + 5, totalItems)
    }));
  }
  const showLessDetailItems = (keyForItems: string) => {
    setVisibleDetailItems(prev => ({ ...prev, [keyForItems]: INITIAL_DETAIL_ITEMS_TO_SHOW }));
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResults(null);
    setShowIntro(false); // Ocultar la intro al iniciar la auditoría
    setExpandedAuditIds({});
    setVisibleDetailItems({});
    setActiveStrategyTab('mobile');

    if (!url) { setError('Por favor, ingresa la URL de un sitio web.'); setShowIntro(true); return; } // Mostrar intro si hay error
    if (!url.startsWith('http://') && !url.startsWith('https://')) { setError('Por favor, ingresa una URL válida (ej. https://example.com)'); setShowIntro(true); return; } // Mostrar intro si hay error

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
        // No mostramos la intro aquí, el error es suficiente.
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
      // No mostramos la intro aquí, el error es suficiente.
    } finally {
      setIsLoading(false);
    }
  };

  // --- Funciones de renderizado (renderSingleStrategyScores, renderCoreWebVitals, renderDiagnosticsSection) SIN CAMBIOS ---
  // ... (Pega aquí tus funciones renderSingleStrategyScores, renderCoreWebVitals, y renderDiagnosticsSection tal cual las tenías)
    const renderSingleStrategyScores = (strategyResult: SinglePageSpeedResult | null | undefined, strategyName: string) => {
    if (!strategyResult || !strategyResult.lighthouseResult?.categories) {
      return <p className="w-full text-center text-gray-500 py-4">No hay datos de Lighthouse para {strategyName}.</p>;
    }
    const categoriesData = strategyResult.lighthouseResult.categories;
    return (
      <div className="mb-8">
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
              <div key={`${strategyName}-${key}`} className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 shadow-md aspect-square">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 flex items-center justify-center mb-2 ${score !== null ? (score >= 90 ? 'border-success' : score >= 50 ? 'border-yellow' : 'border-critical') : 'border-grey'}`}>
                  <span className={`text-2xl sm:text-3xl font-bold ${scoreColorClass}`}>{score !== null ? score : 'N/A'}</span>
                </div>
                <h4 className="mt-1 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{title}</h4>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderCoreWebVitals = (strategyResult: SinglePageSpeedResult | null | undefined, strategyName: string) => {
    if (!strategyResult?.loadingExperience?.metrics) {
      return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 shadow">
          <p className="text-sm text-secondary dark:text-gray-400">No hay datos de Core Web Vitals (datos de campo) disponibles para {strategyName}.</p>
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
      <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 shadow">
        <div className="space-y-3">
          {vitalsToShow.map(vital => {
            const metricData = metrics[vital.key];
            if (!metricData || !metricData.distributions) return ( <div key={vital.key} className="text-sm"><span className="font-medium">{vital.label}:</span> <span className="text-secondary dark:text-gray-400">N/D</span></div> );
            const good = metricData.distributions.find(d => d.min === 0)?.proportion || 0;
            const needsImprovement = metricData.distributions.find(d => d.min !== 0 && d.max !== undefined)?.proportion || 0;
            const poor = metricData.distributions.find(d => d.min !== 0 && d.max === undefined)?.proportion || 0;
            let overallCategory = metricData.category;
            let categoryColorClass = 'bg-surface text-secondary dark:bg-gray-700 dark:text-gray-400'; // Ajuste dark
            if (overallCategory === 'GOOD' || overallCategory === 'FAST') categoryColorClass = 'bg-success/20 text-success dark:bg-success/30 dark:text-success-light'; // Asume que tienes success-light para dark
            else if (overallCategory === 'NEEDS_IMPROVEMENT' || overallCategory === 'AVERAGE') categoryColorClass = 'bg-yellow/20 text-yellow dark:bg-yellow/30 dark:text-yellow-light'; // Asume que tienes yellow-light para dark
            else if (overallCategory === 'POOR' || overallCategory === 'SLOW') categoryColorClass = 'bg-critical/20 text-critical dark:bg-critical/30 dark:text-critical-light'; // Asume que tienes critical-light para dark

            return (
              <div key={vital.key}>
                <div className="flex justify-between items-center text-sm mb-0.5">
                  <span className="font-medium text-secondary dark:text-gray-300">{vital.label}:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColorClass}`}>
                    {metricData.percentile} {vital.key.includes('MS') ? 'ms' : ''} ({overallCategory?.replace('_', ' ') || 'N/A'})
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                  <div style={{ width: `${good * 100}%` }} className="bg-success"></div>
                  <div style={{ width: `${needsImprovement * 100}%` }} className="bg-yellow"></div>
                  <div style={{ width: `${poor * 100}%` }} className="bg-critical"></div>
                </div>
                 <div className="flex justify-between text-xs text-secondary dark:text-gray-400 mt-0.5">
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
    if (!singleStrategyResult || !singleStrategyResult.lighthouseResult || !singleStrategyResult.lighthouseResult.categories?.performance?.auditRefs || !singleStrategyResult.lighthouseResult.audits) {
      return <p className="text-center text-secondary dark:text-gray-400 mt-4">No hay datos de diagnóstico disponibles para la estrategia seleccionada.</p>;
    }
    const { audits, categories } = singleStrategyResult.lighthouseResult;
    const diagnosticAudits = categories.performance.auditRefs
      .filter(ref => (ref.group === 'diagnostics' || (ref.group !== 'load-opportunities' && ref.group !== 'metrics' && ref.group !== 'budgets')) && audits[ref.id] && (audits[ref.id].score !== null && audits[ref.id].score! < 1) )
      .map(ref => audits[ref.id])
      .filter(audit => audit);
    if (diagnosticAudits.length === 0) {
        return ( <div className="mt-8 pt-5 pb-5 border-t border-line dark:border-gray-700 bg-surface dark:bg-gray-800 rounded-lg">
              <h3 className="text-center text-lg font-semibold text-black dark:text-white mt-0 mb-3">Diagnósticos Adicionales</h3>
              <p className="text-center text-success dark:text-success-light">¡Buen trabajo! Todas las auditorías de diagnóstico relevantes pasaron.</p>
            </div> );
    }
    return (
        <div className="mt-8 pt-5 pb-5 border-t border-line dark:border-gray-700 bg-surface dark:bg-gray-800 rounded-lg px-2 sm:px-4">
          <h3 className="text-center text-lg font-semibold text-black dark:text-white mt-0 mb-5">Diagnósticos Adicionales</h3>
          <div className="space-y-4">
            {diagnosticAudits.map((audit) => {
              const keyForExpansion = `${audit.id}-${activeStrategyTab}`;
              const isExpanded = !!expandedAuditIds[keyForExpansion];
              const currentVisibleItems = visibleDetailItems[keyForExpansion] || INITIAL_DETAIL_ITEMS_TO_SHOW;
              const totalDetailItems = audit.details?.items?.length || 0;
              return (
                <div key={keyForExpansion} className="p-3 sm:p-4 border border-line dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-750"> {/* Ajuste dark mode */}
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleAuditExpansion(keyForExpansion)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleAuditExpansion(keyForExpansion); }} aria-expanded={isExpanded} aria-controls={`audit-details-${keyForExpansion}`}>
                    <h4 className="font-semibold text-black dark:text-white text-base sm:text-lg">{audit.title}</h4>
                    <span className="text-secondary dark:text-gray-400"><Icon.CaretDown size={20} weight="bold" className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} /></span>
                  </div>
                  {audit.displayValue && (<p className="text-sm text-secondary dark:text-gray-400 mt-1"><span className="font-medium">{audit.displayValue}</span></p>)}
                  
                  {isExpanded && (
                    <div id={`audit-details-${keyForExpansion}`} className="mt-3 pt-3 border-t border-line dark:border-gray-600">
                      <div className="text-sm text-secondary dark:text-gray-300 mt-2 prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: audit.description }} />
                      {audit.details && audit.details.items && audit.details.items.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-line dark:border-gray-600">
                          <p className="text-xs font-semibold text-grey dark:text-gray-400 mb-2">Elementos específicos:</p>
                          <ul className="list-none pl-0 space-y-2">
                            {audit.details.items.slice(0, currentVisibleItems).map((item: AuditDetailItem, index: number) => (
                              <li key={index} className="text-xs text-black dark:text-gray-200 bg-surface dark:bg-gray-700 p-2 rounded break-words">
                                {item.url && (<div className="mb-1"><strong>URL:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-mono text-blue dark:text-blue-400 hover:underline block truncate">{item.url}</a></div>)}
                                {item.node?.snippet && (<div className="mt-1"><strong>Elemento:</strong> <div className="overflow-x-auto bg-gray-200 dark:bg-gray-600 p-1 rounded max-w-full mt-0.5"><code className="font-mono text-xs block whitespace-pre">{item.node.snippet}</code></div></div>)}
                                {item.node?.selector && (<div className="mt-1"><strong>Selector:</strong> <code className="font-mono text-xs bg-gray-200 dark:bg-gray-600 p-1 rounded">{item.node.selector}</code></div>)}
                                {item.node?.nodeLabel && (<div className="mt-1"><strong>Etiqueta del Nodo:</strong> {item.node.nodeLabel}</div>)}
                                {typeof item.wastedMs === 'number' && (<div className="mt-1"><strong>Ahorro potencial (tiempo):</strong> {Math.round(item.wastedMs)} ms</div>)}
                                {typeof item.wastedBytes === 'number' && (<div className="mt-1"><strong>Ahorro potencial (tamaño):</strong> {Math.round(item.wastedBytes / 1024)} KB</div>)}
                                {typeof item.totalBytes === 'number' && !item.wastedBytes && (<div className="mt-1"><strong>Tamaño:</strong> {Math.round(item.totalBytes / 1024)} KB</div>)}
                                {Object.keys(item).filter(k => !['url', 'node', 'wastedMs', 'wastedBytes', 'totalBytes', 'sourceLocation'].includes(k)).map(propKey => ( (typeof item[propKey] === 'string' || typeof item[propKey] === 'number') && <div key={propKey} className="mt-1"><strong>{propKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}:</strong> {String(item[propKey])}</div> ))}
                              </li>
                            ))}
                          </ul>
                          {totalDetailItems > currentVisibleItems && (<button onClick={() => showMoreDetailItems(keyForExpansion, totalDetailItems)} className="text-xs text-blue dark:text-blue-400 hover:underline mt-2 font-medium">Mostrar más ({totalDetailItems - currentVisibleItems} restantes)</button>)}
                          {currentVisibleItems > INITIAL_DETAIL_ITEMS_TO_SHOW && (<button onClick={() => showLessDetailItems(keyForExpansion)} className="text-xs text-blue dark:text-blue-400 hover:underline mt-2 ml-2 font-medium">Mostrar menos</button>)}
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


  const activeStrategyResult = activeStrategyTab === 'mobile' ? results?.mobileResult : results?.desktopResult;

  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header"><TopNavTwo /><MenuOne /></header>
        <main className="content py-10 md:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
                Auditoría Web Avanzada
              </h1>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(null); if (results || error) setShowIntro(true); setResults(null); setError(null);}} // Restablecer y mostrar intro si se cambia URL después de resultados/error
                  placeholder="https://ejemplo.com"
                  required
                  className="flex-grow w-full caption11 bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`button-main text-white text-base font-medium rounded-full px-8 py-3 w-full sm:w-auto transition-colors duration-150 ease-in-out whitespace-nowrap ${isLoading ? 'bg-grey hover:bg-grey cursor-not-allowed dark:bg-gray-500 dark:hover:bg-gray-500' : 'bg-blue hover:bg-dark-blue dark:bg-blue-600 dark:hover:bg-blue-700'}`}
                >
                  {isLoading ? (
                    <>
                      <Icon.CircleNotch className="animate-spin mr-2 inline-block h-5 w-5" />
                      Auditando...
                    </>
                  ) : 'Auditar Sitio'}
                </button>
              </form>
            </div>

            {/* --- SECCIÓN INTRODUCTORIA CONDICIONAL --- */}
            {showIntro && !isLoading && !results && !error && (
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 md:mb-16 p-6 md:p-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
                <div className="md:w-1/2 flex justify-center md:justify-start">
                  <img
                    src="https_pagespeed.web.dev_static_images_psi_hero_poster_2x.png" // REEMPLAZA ESTA IMAGEN
                    alt="Ilustración de auditoría web"
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md object-contain rounded"
                  />
                </div>
                <div className="md:w-1/2 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white mb-4">
                    Mejora la velocidad de tus páginas web en todos los dispositivos
                  </h2>
                  <p className="text-secondary dark:text-gray-300 mb-3 text-base sm:text-lg">
                    Obtén un análisis detallado del rendimiento de tu sitio, identifica cuellos de botella y recibe recomendaciones personalizadas para optimizar la experiencia de tus usuarios.
                  </p>
                  <p className="text-secondary dark:text-gray-300 mb-5 text-base sm:text-lg">
                    Nuestra herramienta utiliza la tecnología de Google PageSpeed Insights para evaluar tu web en base a métricas clave y mejores prácticas.
                  </p>
                  <div className="space-y-2">
                    <a href="#resultados-auditoria" onClick={(e) => { if (!results) e.preventDefault(); }} className={`text-blue dark:text-blue-400 hover:underline block font-medium ${!results ? 'opacity-50 cursor-not-allowed' : ''}`}>Consulta más información sobre los resultados</a>
                    <a href="/blog/category/optimizacion-web" className="text-blue dark:text-blue-400 hover:underline block font-medium">Novedades y Consejos de Optimización</a>
                    <a href="https://web.dev/learn/performance/" target="_blank" rel="noopener noreferrer" className="text-blue dark:text-blue-400 hover:underline block font-medium">Más información sobre el rendimiento web (web.dev)</a>
                  </div>
                </div>
              </div>
            )}
            {/* --- FIN SECCIÓN INTRODUCTORIA --- */}


            {/* --- ESTADO DE CARGA CON ESQUELETO --- */}
            {isLoading && <AuditSkeletonLoader />}

            {/* --- MENSAJE DE ERROR --- */}
            {!isLoading && error && (
              <div className="text-center my-8 p-4 rounded-md bg-critical/10 border border-critical/30">
                <Icon.WarningCircle size={48} className="text-critical mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-critical mb-2">Error en la Auditoría</h3>
                <p className="text-critical/90 text-base">{error}</p>
                <button
                    onClick={() => { setError(null); setUrl(''); setShowIntro(true); }}
                    className="mt-4 px-4 py-2 bg-blue text-white rounded hover:bg-dark-blue text-sm font-medium"
                >
                    Intentar con otra URL
                </button>
              </div>
            )}

            {/* --- RESULTADOS DE LA AUDITORÍA --- */}
            {!isLoading && !error && results && (
              <div id="resultados-auditoria">
                {/* ... (tu lógica de tabs y renderizado de resultados existente) ... */}
                <div className="flex justify-center mb-6 border-b border-line dark:border-gray-700">
                  <button
                    onClick={() => setActiveStrategyTab('mobile')}
                    className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium -mb-px border-b-2 transition-colors
                                ${activeStrategyTab === 'mobile' ? 'border-blue text-blue dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-secondary hover:text-black dark:text-gray-400 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'}`}
                  >
                    Mobile
                  </button>
                  <button
                    onClick={() => setActiveStrategyTab('desktop')}
                    className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium -mb-px border-b-2 transition-colors
                                ${activeStrategyTab === 'desktop' ? 'border-blue text-blue dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-secondary hover:text-black dark:text-gray-400 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'}`}
                  >
                    Desktop
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white mb-6 sm:mb-8 text-center">
                  Resultados para {activeStrategyTab.charAt(0).toUpperCase() + activeStrategyTab.slice(1)}
                </h2>

                {activeStrategyResult && activeStrategyResult.lighthouseResult ? (
                  <>
                    {activeStrategyResult.lighthouseResult.requestedUrl && (
                        <p className="text-center text-sm sm:text-base text-secondary dark:text-gray-400 mb-6 sm:mb-8">
                            Analizando: <a href={activeStrategyResult.lighthouseResult.requestedUrl} target="_blank" rel="noopener noreferrer" className="text-blue dark:text-blue-400 hover:underline">{activeStrategyResult.lighthouseResult.requestedUrl}</a>
                        </p>
                    )}
                    {renderSingleStrategyScores(activeStrategyResult, activeStrategyTab.charAt(0).toUpperCase() + activeStrategyTab.slice(1))}

                    {activeStrategyResult.loadingExperience && (
                        <div className="my-10 sm:my-12">
                            <h3 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-4 sm:mb-6 text-center">Core Web Vitals (Datos de Campo)</h3>
                            {renderCoreWebVitals(activeStrategyResult, activeStrategyTab.charAt(0).toUpperCase() + activeStrategyTab.slice(1))}
                        </div>
                    )}

                    {renderDiagnosticsSection(activeStrategyResult)}
                  </>
                ) : (
                  <p className="text-center text-secondary dark:text-gray-400 my-10 sm:my-12 text-base">
                    No hay datos disponibles para la vista {activeStrategyTab}.
                    {activeStrategyTab === 'mobile' && results?.mobileResult?.error ? ` Error: ${results.mobileResult.error.message}` : ''}
                    {activeStrategyTab === 'desktop' && results?.desktopResult?.error ? ` Error: ${results.desktopResult.error.message}` : ''}
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