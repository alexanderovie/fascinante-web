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

  // Función para renderizar las puntuaciones principales de Lighthouse horizontalmente
  const renderLighthouseScoresHorizontal = (categories: LighthouseResult['categories'] | undefined) => {
    if (!categories) {
      // Este mensaje no debería mostrarse si la lógica principal ya maneja la ausencia de lighthouseResult
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
            border: '1px solid #e0e0e0', // Borde sutil por defecto
            padding: '20px',
            borderRadius: '8px', 
            backgroundColor: '#ffffff', // Fondo blanco por defecto, o deja que herede
            textAlign: 'center',
            flex: '1 1 200px', // Permite que los items crezcan y se encojan, con base de 200px
            minWidth: '180px', // Para que no se hagan demasiado pequeños
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)' // Sombra sutil por defecto
          }}
        >
          <h3 style={{ marginTop: '0', marginBottom: '10px', fontSize: '1.1em', color: '#333' /* color de texto por defecto */ }}>
            {title}
          </h3>
          {score !== null ? (
            <p style={{ 
              fontSize: '2.2em', 
              fontWeight: 'bold', 
              margin: '5px 0 0 0', // Ajuste de margen
              color: score >= 90 ? '#34a853' : score >= 50 ? '#fbbc05' : '#ea4335' // Colores típicos de PSI
            }}>
              {score}
              {/* Eliminamos el "/ 100" para un look más limpio como los gauges de PSI */}
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
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' /* Fuente genérica por defecto */ }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Auditoría Web Simple</h1>
        <p>Ingresa una URL para obtener un informe básico de PageSpeed Insights.</p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '40px' /* Más espacio antes de resultados */ }}>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          placeholder="https://ejemplo.com"
          required
          style={{ flexGrow: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '12px 20px', backgroundColor: isLoading ? '#ccc' : '#1a73e8' /* Azul Google */, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }}>
          {isLoading ? 'Auditando...' : 'Auditar Sitio'}
        </button>
      </form>

      {isLoading && <p style={{ textAlign: 'center', fontSize: '1.1em', margin: '20px 0' }}>Cargando resultados...</p>}
      
      {error && (
        <p style={{ color: '#d93025' /* Rojo Google */, textAlign: 'center', background: '#fce8e6', border: '1px solid #fcc6c0', padding: '10px', borderRadius: '4px', margin: '20px 0' }}>
          Error: {error}
        </p>
      )}

      {results && !error && (
        <div>
          {results.lighthouseResult && results.lighthouseResult.requestedUrl && (
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.4em', color: '#3c4043' }}>
              Resultados para: <a href={results.lighthouseResult.requestedUrl} target="_blank" rel="noopener noreferrer" style={{color: '#1a73e8'}}>{results.lighthouseResult.requestedUrl}</a>
            </h2>
          )}

          {/* Contenedor para las puntuaciones horizontales */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-around', // O 'space-between'
            flexWrap: 'wrap', // Para que se ajusten en pantallas pequeñas
            gap: '20px', // Espacio entre los bloques de puntuación
            marginBottom: '40px' 
          }}>
            {results.lighthouseResult ? 
              renderLighthouseScoresHorizontal(results.lighthouseResult.categories) :
              // Este mensaje se mostraría si !results.lighthouseResult pero results sí existe y no hay error
              // Lo cual fue manejado en handleSubmit, por lo que es menos probable que se vea aquí.
              <p style={{ width: '100%', textAlign: 'center' }}>No se encontraron datos de Lighthouse para esta URL.</p> 
            }
          </div>
          
          {/* Indicador simple para Core Web Vitals (datos de campo) */}
          {(results.loadingExperience && results.loadingExperience.metrics && Object.keys(results.loadingExperience.metrics).length > 0) || 
           (results.loadingExperience && (!results.loadingExperience.metrics || Object.keys(results.loadingExperience.metrics).length === 0)) ? (
            <div style={{ marginTop: '30px', borderTop: '1px solid #e0e0e0', paddingTop: '20px', paddingBottom: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: '15px', color: '#3c4043' }}>Experiencia de Carga (Core Web Vitals)</h3>
              {results.loadingExperience.metrics && Object.keys(results.loadingExperience.metrics).length > 0 ? (
                <p style={{textAlign: 'center', color: '#34a853', fontSize: '1.1em' }}>Se encontraron datos de campo para esta URL.</p>
              ) : (
                <p style={{ textAlign: 'center', color: '#5f6368' }}>No se encontraron métricas de datos de campo para esta URL.</p>
              )}
            </div>
          ) : null }
        </div>
      )}
    </div>
  );
}