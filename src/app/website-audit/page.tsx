// src/app/website-audit/page.tsx
'use client';

import { useState, FormEvent } from 'react';

// Define una estructura básica para los resultados que quieres mostrar
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
    // pwa?: PageSpeedCategoryScore; // Descomentar si se solicita en la API
  };
  audits?: {
    'final-screenshot'?: { // Para mostrar una captura de pantalla
      details?: {
        data: string;
      }
    }
  };
  requestedUrl?: string;
  finalUrl?: string;
}

// Interfaz principal para los resultados de PageSpeed
interface PageSpeedApiResult {
  lighthouseResult?: LighthouseResult;
  loadingExperience?: { // Core Web Vitals (Datos de campo)
    metrics: {
      // La estructura exacta puede variar, pero típicamente son objetos
      [key: string]: {
        percentile: number;
        category: string; // Ejemplo: 'FAST', 'AVERAGE', 'SLOW'
        // Podría haber más campos como distributions, etc.
      }
    } | null; // metrics puede ser null
  } | null; // loadingExperience puede ser null
  // La API puede devolver un error a nivel raíz también
  error?: {
    code: number;
    message: string;
    errors: Array<{ message: string; domain: string; reason: string }>;
  };
}


export default function WebsiteAuditPage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<PageSpeedApiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!url) {
      setError('Por favor, ingresa la URL de un sitio web.');
      return;
    }
    // Validación simple de URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        setError('Por favor, ingresa una URL válida (ej. https://example.com)');
        return;
    }


    setIsLoading(true);
    setResults(null);
    setError(null);

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
        // Usar el mensaje de error de nuestra API si está disponible, o el statusText del response
        throw new Error(data.error?.message || `Error al auditar: ${response.statusText}`);
      }
      
      // Comprobar si la propia API de PageSpeed devolvió un error en el cuerpo de la respuesta
      if (data.error) {
        console.error("Error de la API de PageSpeed:", data.error);
        setError(`Error de PageSpeed: ${data.error.message}`);
        setResults(null); // Asegurarse de limpiar resultados previos si hay error
      } else {
        setResults(data);
      }

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderScores = (categories: LighthouseResult['categories'] | undefined) => {
    if (!categories) return <p>No se encontraron datos de categorías de Lighthouse.</p>;

    const scoresToShow: (keyof LighthouseResult['categories'])[] = ['performance', 'accessibility', 'best-practices', 'seo'];
    
    return scoresToShow.map(key => {
      const category = categories[key];
      // Asegurarse de que la categoría existe antes de intentar renderizarla
      if (!category || category.score === null || category.score === undefined) {
        return (
            <div key={key} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3>{category?.title || key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'grey' }}>
                Puntuación: N/A
              </p>
            </div>
          );
      }
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

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Auditoría de Rendimiento Web</h1>
        <p>Ingresa una URL para obtener un informe de PageSpeed Insights.</p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }} // Limpiar error al escribir
          placeholder="https://ejemplo.com"
          required
          style={{ flexGrow: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '12px 20px', backgroundColor: isLoading? '#aaa' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }}>
          {isLoading ? 'Auditando...' : 'Auditar Sitio'}
        </button>
      </form>

      {isLoading && <p style={{ textAlign: 'center', fontSize: '1.1em' }}>Cargando resultados, esto puede tardar un momento...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', background: '#ffebee', border: '1px solid #ffcdd2', padding: '10px', borderRadius: '4px' }}>Error: {error}</p>}

      {results && (
        <div>
          {results.lighthouseResult ? (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Resultados para: <a href={results.lighthouseResult.requestedUrl} target="_blank" rel="noopener noreferrer">{results.lighthouseResult.requestedUrl}</a></h2>
              
              {results.lighthouseResult.audits?.['final-screenshot']?.details?.data && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <h4>Captura de Pantalla Analizada:</h4>
                  <img 
                    src={results.lighthouseResult.audits['final-screenshot'].details.data} 
                    alt="Captura de pantalla de la página analizada" 
                    style={{maxWidth: '100%', border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px'}}
                  />
                </div>
              )}
              {renderScores(results.lighthouseResult.categories)}
            </>
          ) : results.error ? ( // Si hubo un error a nivel raíz de la API de PageSpeed
            <p style={{ textAlign: 'center' }}>No se pudieron obtener los resultados de Lighthouse debido a un error de la API: {results.error.message}</p>
          ) : (
            // Si no hay lighthouseResult Y no hay un error a nivel raíz, puede ser un caso extraño o una URL no auditable.
            !isLoading && !error && <p style={{ textAlign: 'center' }}>No se encontraron resultados de Lighthouse para esta URL. Puede que la URL no sea pública, no sea accesible o no haya devuelto datos de Lighthouse.</p>
          )}
          
          {/* Sección para mostrar Core Web Vitals (loadingExperience) actualizada */}
          {results && results.loadingExperience && results.loadingExperience.metrics && Object.keys(results.loadingExperience.metrics).length > 0 ? (
            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h3 style={{ textAlign: 'center' }}>Experiencia de Carga (Core Web Vitals - Datos de Campo):</h3>
              {Object.entries(results.loadingExperience.metrics).map(([metricName, metricDataObject]) => {
                // Formatear el nombre de la métrica para mejor legibilidad
                const formattedMetricName = metricName
                  .replace(/_/g, ' ')
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                // Asegurarse que metricDataObject es un objeto y tiene las propiedades esperadas
                // La API puede devolver objetos vacíos para algunas métricas si no hay datos.
                if (typeof metricDataObject === 'object' && metricDataObject !== null && 'percentile' in metricDataObject && 'category' in metricDataObject) {
                  return (
                    <div key={metricName} style={{ border: '1px solid #eee', padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: '#fcfcfc' }}>
                      <strong>{formattedMetricName}:</strong>{' '}
                      {metricDataObject.percentile} (Categoría: {metricDataObject.category})
                    </div>
                  );
                }
                return ( // Mostrar algo si la métrica no tiene datos completos
                    <div key={metricName} style={{ border: '1px solid #eee', padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: '#fcfcfc' }}>
                      <strong>{formattedMetricName}:</strong> Datos no disponibles
                    </div>
                );
              })}
            </div>
          ) : results && results.loadingExperience && (!results.loadingExperience.metrics || Object.keys(results.loadingExperience.metrics).length === 0) ? (
            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h3 style={{ textAlign: 'center' }}>Experiencia de Carga (Core Web Vitals - Datos de Campo):</h3>
              <p style={{ textAlign: 'center' }}>No se encontraron métricas de datos de campo para esta URL.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}