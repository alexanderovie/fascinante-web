// src/app/api/pagespeed/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url: targetUrl } = await request.json();

    if (!targetUrl) {
      return NextResponse.json({ error: 'La URL es requerida' }, { status: 400 });
    }

    // Validar formato de URL (básico)
    try {
      new URL(targetUrl);
    } catch (e) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }


    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      console.error('La clave API de PageSpeed no está configurada.');
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    // Elige la estrategia: 'DESKTOP' o 'MOBILE'. Puedes hacerla configurable.
    const strategy = 'DESKTOP';
    // Puedes añadir más categorías: &category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&category=PWA
    const categories = '&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO';
    const pagespeedApiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&key=${apiKey}&strategy=${strategy}${categories}`;

    console.log(`Solicitando a PageSpeed: ${pagespeedApiUrl.replace(apiKey, 'REDACTED_API_KEY')}`);

    const pagespeedResponse = await fetch(pagespeedApiUrl);

    if (!pagespeedResponse.ok) {
      const errorData = await pagespeedResponse.json();
      console.error('Error de la API de PageSpeed:', errorData);
      return NextResponse.json({ error: 'No se pudieron obtener los datos de PageSpeed', details: errorData.error?.message || 'Error desconocido' }, { status: pagespeedResponse.status });
    }

    const data = await pagespeedResponse.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error en el proxy de la API de PageSpeed:', error);
    return NextResponse.json({ error: 'Error Interno del Servidor', details: error.message }, { status: 500 });
  }
}