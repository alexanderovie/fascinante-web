// src/app/api/pagespeed/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Función auxiliar para realizar una solicitud a PageSpeed Insights
async function fetchPageSpeedData(targetUrl: string, strategy: 'DESKTOP' | 'MOBILE', apiKey: string, locale: string) {
  const categories = '&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO';
  const pagespeedApiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&key=${apiKey}&strategy=${strategy}${categories}&locale=${locale}`;
  
  console.log(`Solicitando a PageSpeed Insights (Strategy: ${strategy}, Locale: ${locale}): ${pagespeedApiUrl.replace(apiKey, 'REDACTED_API_KEY')}`);
  
  const response = await fetch(pagespeedApiUrl);
  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Error de la API de PageSpeed (${strategy}):`, errorData);
    // Lanzamos un error para que Promise.all lo capture si una de las solicitudes falla
    throw new Error(errorData.error?.message || `Error de la API (${strategy}): ${response.statusText}`);
  }
  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const { url: targetUrl } = await request.json();

    if (!targetUrl) {
      return NextResponse.json({ error: 'La URL es requerida' }, { status: 400 });
    }
    try {
      new URL(targetUrl);
    } catch (e) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      console.error('La clave API de PageSpeed no está configurada.');
      return NextResponse.json({ error: 'Error de configuración del servidor: Clave API no encontrada' }, { status: 500 });
    }

    const locale = 'es'; // Resultados en español

    // Realizar ambas solicitudes (desktop y mobile) en paralelo
    const [desktopData, mobileData] = await Promise.all([
      fetchPageSpeedData(targetUrl, 'DESKTOP', apiKey, locale),
      fetchPageSpeedData(targetUrl, 'MOBILE', apiKey, locale)
    ]).catch(error => {
      // Si una de las promesas es rechazada, Promise.all se rechaza.
      // Capturamos ese error aquí.
      console.error('Una o más solicitudes a PageSpeed fallaron:', error);
      // Devolvemos null para indicar que hubo un problema y que el frontend lo maneje.
      // O podrías devolver un error más específico.
      return [null, null]; 
    });

    // Si alguna de las solicitudes falló y devolvimos null.
    if (!desktopData && !mobileData) {
        return NextResponse.json(
            { error: 'No se pudieron obtener todos los datos de PageSpeed. Inténtalo de nuevo.'},
            { status: 500 } // O un código de error más apropiado
        );
    }
    
    // Combinar los resultados
    const combinedResults = {
      desktopResult: desktopData, // Puede ser null si solo esa falló y no se manejó arriba
      mobileResult: mobileData,   // Puede ser null si solo esa falló y no se manejó arriba
    };

    return NextResponse.json(combinedResults);

  } catch (error: any) {
    console.error('Error interno en el proxy de la API de PageSpeed:', error);
    return NextResponse.json(
      { 
        error: 'Error Interno del Servidor', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
