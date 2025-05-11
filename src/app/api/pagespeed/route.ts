// src/app/api/pagespeed/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Extraer la URL del cuerpo de la solicitud
    const { url: targetUrl } = await request.json();

    // Validar que la URL fue proporcionada
    if (!targetUrl) {
      return NextResponse.json({ error: 'La URL es requerida' }, { status: 400 });
    }

    // Validación básica del formato de la URL
    try {
      new URL(targetUrl); // Intenta crear un objeto URL para validar el formato
    } catch (e) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    // Obtener la clave API de las variables de entorno
    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      console.error('La clave API de PageSpeed no está configurada en las variables de entorno.');
      return NextResponse.json({ error: 'Error de configuración del servidor: Clave API no encontrada' }, { status: 500 });
    }

    // Configuración para la solicitud a la API de PageSpeed Insights
    const strategy = 'DESKTOP'; // Puedes cambiar a 'MOBILE' o hacerlo configurable desde el frontend
    const categories = '&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO'; // Categorías a analizar
    const locale = 'es'; // Especificar el idioma para los resultados

    // Construir la URL para la API de PageSpeed Insights
    const pagespeedApiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&key=${apiKey}&strategy=${strategy}${categories}&locale=${locale}`;

    // Loggear la URL de la solicitud (sin la clave API por seguridad en logs públicos)
    console.log(`Solicitando a PageSpeed Insights (Locale: ${locale}): ${pagespeedApiUrl.replace(apiKey, 'REDACTED_API_KEY')}`);

    // Realizar la solicitud a la API de PageSpeed Insights
    const pagespeedResponse = await fetch(pagespeedApiUrl);

    // Verificar si la respuesta de la API fue exitosa
    if (!pagespeedResponse.ok) {
      const errorData = await pagespeedResponse.json(); // Intentar obtener detalles del error de la API
      console.error('Error de la API de PageSpeed:', errorData);
      return NextResponse.json(
        { 
          error: 'No se pudieron obtener los datos de PageSpeed', 
          details: errorData.error?.message || `Error de la API: ${pagespeedResponse.statusText}` 
        }, 
        { status: pagespeedResponse.status }
      );
    }

    // Parsear la respuesta JSON de la API
    const data = await pagespeedResponse.json();
    
    // Devolver los datos al cliente
    return NextResponse.json(data);

  } catch (error: any) {
    // Manejar errores inesperados durante el proceso
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
