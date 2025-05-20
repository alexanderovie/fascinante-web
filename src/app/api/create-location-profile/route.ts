// src/app/api/create-location-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios'; // Usaremos axios para la llamada al servicio externo

// No necesitamos cliente Supabase aquí a menos que quieras guardar un registro del intento o resultado

const EXTERNAL_LOCATION_API_KEY = process.env.BRIGHTLOCAL_API_KEY; // Usa el nombre de tu variable de entorno
const EXTERNAL_LOCATION_CREATE_ENDPOINT = 'https://api.brightlocal.com/manage/v1/locations';

interface ExternalLocationPayload {
  business_name: string;
  location_reference: string;
  country: string; // código de 3 letras, ej. USA
  address: {
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
    region: string; // Nombre completo del estado/provincia
    region_code?: string; // Código del estado/provincia (ej. NY)
  };
  telephone: string;
  business_category_id: number;
  description: string;
  urls?: {
    website_url?: string;
    // ... otros tipos de URL que el servicio externo soporte
  };
  geo_location?: {
    latitude?: number;
    longitude?: number;
  };
  // ... cualquier otro campo que el servicio externo requiera o acepte
}

export async function POST(request: NextRequest) {
  // Verificar la API Key del servicio externo
  if (!EXTERNAL_LOCATION_API_KEY) {
    console.error('Error: La API Key para el servicio de ubicación externo no está configurada en el servidor.');
    return NextResponse.json({ error: 'Server configuration error: External API Key missing.' }, { status: 500 });
  }

  let payloadFromFrontend: ExternalLocationPayload;
  try {
    payloadFromFrontend = await request.json();
  } catch (e) {
    console.error('Error parsing request body:', e);
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Validación básica del payload recibido (puedes añadir más según los requisitos del servicio externo)
  if (!payloadFromFrontend.business_name || !payloadFromFrontend.country || !payloadFromFrontend.business_category_id || !payloadFromFrontend.description || !payloadFromFrontend.location_reference) {
    return NextResponse.json({ error: 'Missing required fields in payload: business_name, country, business_category_id, description, and location_reference are required.' }, { status: 400 });
  }

  try {
    console.log('[API CreateLocation] Enviando payload al servicio externo:', payloadFromFrontend);

    const externalApiResponse = await axios.post(EXTERNAL_LOCATION_CREATE_ENDPOINT, payloadFromFrontend, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': EXTERNAL_LOCATION_API_KEY, // Así es como BrightLocal lo espera
      },
    });

    console.log('[API CreateLocation] Respuesta del servicio externo:', externalApiResponse.status, externalApiResponse.data);

    // El servicio externo debería devolver un 200 o 201 en caso de éxito.
    // La respuesta podría contener el ID de la nueva ubicación u otros detalles.
    // Ajusta esto según la respuesta real del servicio.
    if (externalApiResponse.status === 200 || externalApiResponse.status === 201) {
      return NextResponse.json({
        success: true,
        message: externalApiResponse.data.message || 'Location profile created successfully with the external service!', // El servicio externo podría devolver un mensaje
        location_id: externalApiResponse.data.location_id || externalApiResponse.data.id || externalApiResponse.data['location-id'], // Ajusta según cómo devuelvan el ID
        data: externalApiResponse.data // Opcional: devolver todos los datos de la respuesta del servicio
      }, { status: externalApiResponse.status });
    } else {
      // Si el servicio externo devuelve un estado de error pero no lanza una excepción axios
      console.error('[API CreateLocation] El servicio externo devolvió un estado no exitoso:', externalApiResponse.status, externalApiResponse.data);
      return NextResponse.json({
        success: false,
        error: externalApiResponse.data.error || externalApiResponse.data.message || 'Failed to create location profile with the external service.',
        details: externalApiResponse.data // Devolver detalles del error del servicio externo
      }, { status: externalApiResponse.status });
    }

  } catch (error: any) {
    console.error('[API CreateLocation] Error llamando al servicio de ubicación externo:');
    if (error.response) {
      // La solicitud se hizo y el servidor respondió con un código de estado
      // que cae fuera del rango de 2xx
      console.error('Datos del error:', error.response.data);
      console.error('Estado del error:', error.response.status);
      console.error('Encabezados del error:', error.response.headers);
      return NextResponse.json({
        error: 'Error from external location service.',
        details: error.response.data
      }, { status: error.response.status || 502 }); // 502 Bad Gateway si el servicio externo falla
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error('No se recibió respuesta del servicio externo:', error.request);
      return NextResponse.json({ error: 'No response from external location service.' }, { status: 504 }); // 504 Gateway Timeout
    } else {
      // Algo sucedió al configurar la solicitud que provocó un error
      console.error('Error al configurar la solicitud al servicio externo:', error.message);
      return NextResponse.json({ error: 'Error setting up request to external location service.' }, { status: 500 });
    }
  }
}