// src/app/website-audit/page.tsx
'use client';

import { useState, FormEvent } from 'react';

// --- Interfaces (se mantienen igual para la correcta recepción de datos de la API) ---
interface PageSpeedCategoryScore {
  id: string;
  title: string;
  score: number | null; // La API devuelve 0-1, lo mostraremos como 0-100
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
  audits?: { // Se mantiene por si se quiere usar en el futuro, pero no se renderizará la captura
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
    setError(null); // Limpiar errores previos
    setResults(null); // Limpiar resultados previos

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
        // Si no hay error explícito pero tampoco lighthouseResult
        setError('No se encontraron resultados de Lighthouse para esta URL. Puede que no sea pública o auditable.');
        console.warn("Respuesta de PageSpeed sin lighthouseResult:", data);
      }else {
        setResults(data);
      }

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para renderizar las puntuaciones principales de Lighthouse
  const renderLighthouseScores = (categories: LighthouseResult['categories'] | undefined) => {
    if (!categories) {
      return <p>No se pudieron cargar las categorías de Lighthouse.</p>;
    }

    const scoresToDisplay: (keyof LighthouseResult['categories'])[] = ['performance', 'accessibility', 'best-practices', 'seo'];
    
    return scoresToDisplay.map(key => {
      const category = categories[key];
      
      // Si la categoría específica no existe o no tiene puntuación
      if (!category || typeof category.score !== 'number') {
        return (
          <div key={key} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3>{category?.title || key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}</h3>
            <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'grey' }}>Puntuación: N/A</p>
          </div>
        );
      }

      // Renderizar la puntuación si existe
      return (
        <div key={category.id} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>{category.title}</h3>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: category.score >= 0.9 ? 'green' : category.score >= 0.5 ? 'orange' : 'red' }}>
            Puntuación: {Math.round(category.score * 100)} / 100
          </p>
        </div>
      );
    });
  };

  // --- JSX del Componente ---
  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Auditoría Web Simple</h1>
        <p>Ingresa una URL para obtener un informe básico de PageSpeed Insights.</p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          placeholder="https://ejemplo.com"
          required
          style={{ flexGrow: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '12px 20px', backgroundColor: isLoading ? '#aaa' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }}>
          {isLoading ? 'Auditando...' : 'Auditar Sitio'}
        </button>
      </form>

      {isLoading && <p style={{ textAlign: 'center', fontSize: '1.1em' }}>Cargando resultados...</p>}
      
      {error && (
        <p style={{ color: 'red', textAlign: 'center', background: '#ffebee', border: '1px solid #ffcdd2', padding: '10px', borderRadius: '4px' }}>
          Error: {error}
        </p>
      )}

      {results && !error && ( // Solo mostrar resultados si no hay error y hay resultados
        <div>
          {results.lighthouseResult && results.lighthouseResult.requestedUrl && (
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
              Resultados para: <a href={results.lighthouseResult.requestedUrl} target="_blank" rel="noopener noreferrer">{results.lighthouseResult.requestedUrl}</a>
            </h2>
          )}

          {/* Renderizar puntuaciones de Lighthouse */}
          {results.lighthouseResult ? 
            renderLighthouseScores(results.lighthouseResult.categories) :
            <p style={{ textAlign: 'center' }}>No se encontraron datos de Lighthouse para esta URL.</p>
          }
          
          {/* Indicador simple para Core Web Vitals (datos de campo) */}
          {results.loadingExperience && results.loadingExperience.metrics && Object.keys(results.loadingExperience.metrics).length > 0 && (
            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h3 style={{ textAlign: 'center' }}>Experiencia de Carga (Core Web Vitals)</h3>
              <p style={{textAlign: 'center', color: 'green'}}>Se encontraron datos de campo para esta URL.</p>
              {/* Si quisieras mostrar una métrica específica simple, podrías hacer algo como:
                (results.loadingExperience.metrics as any).FIRST_CONTENTFUL_PAINT_MS && (
                  <p style={{textAlign: 'center'}}>
                    FCP: {(results.loadingExperience.metrics as any).FIRST_CONTENTFUL_PAINT_MS.percentile}ms 
                    ({(results.loadingExperience.metrics as any).FIRST_CONTENTFUL_PAINT_MS.category})
                  </p>
                )
              */}
            </div>
          )}
          {results.loadingExperience && (!results.loadingExperience.metrics || Object.keys(results.loadingExperience.metrics).length === 0) && (
             <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
               <h3 style={{ textAlign: 'center' }}>Experiencia de Carga (Core Web Vitals)</h3>
               <p style={{ textAlign: 'center' }}>No se encontraron métricas de datos de campo para esta URL.</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}