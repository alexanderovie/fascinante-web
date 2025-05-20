// src/app/api/seo-local-api/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'; // CAMBIO AQUÍ
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

import {
  createLocationInBrightLocal,
  upsertSupabaseLocation,
} from '@/lib/seoLocalService/locationService';
import {
  BrightLocalCreateLocationPayload,
  ClientLocationSupabaseRow,
} from '@/lib/seoLocalService/types';

// Interfaz para el payload esperado por esta API route desde el cliente
interface CreateLocationApiPayload {
  agencyClientId: string; // El UUID de tu tabla agency_clients
  businessName: string;
  countryCode: string; // ISO 3
  address1: string;
  address2?: string;
  city?: string;
  stateProvince?: string; // 'region' en BrightLocal
  regionCode?: string;
  postalCode?: string;
  telephone: string;
  websiteUrl: string;
  businessCategoryId: number; // ID de categoría de BrightLocal
  description: string;
  // Campos adicionales que podrías enviar desde el frontend
  menuUrl?: string;
  reservationUrl?: string;
  orderUrl?: string;
  galleryUrl?: string;
  eventUrl?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactMobile?: string;
  contactEmail?: string;
  contactFax?: string;
  numberOfEmployees?: number;
  openingHours?: any; // Considera definir un tipo más específico
  formationDate?: string; // "mm-yyyy"
  extraBusinessCategoryIds?: number[];
  latitude?: number;
  longitude?: number;
  paymentMethods?: string[];
  servicesOrProducts?: string[];
  timezone?: string;
  isServiceAreaBusiness?: boolean;
  languageCode?: string; // Ej: "CAN:FR"
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  // Crear el cliente Supabase para este request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignorar errores si ocurren en el entorno de pre-renderizado o
            // si las cookies no se pueden establecer en este contexto.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignorar errores si ocurren en el entorno de pre-renderizado.
          }
        },
      },
    }
  );

  // Opcional: Verificar autenticación del usuario si es necesario
  // const { data: { user }, error: authError } = await supabase.auth.getUser();
  // if (authError || !user) {
  //   console.error('Error de autenticación:', authError);
  //   return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  // }

  let requestPayload: CreateLocationApiPayload;
  try {
    requestPayload = await request.json();
  } catch (error) {
    console.error('Error al parsear JSON del request:', error);
    return NextResponse.json({ error: 'Request inválido: no se pudo parsear JSON.' }, { status: 400 });
  }

  // --- Validación del Payload (MUY IMPORTANTE) ---
  // Reemplazar con Zod u otra validación robusta
  if (
    !requestPayload.businessName ||
    !requestPayload.countryCode ||
    !requestPayload.address1 ||
    !requestPayload.telephone ||
    !requestPayload.agencyClientId ||
    !requestPayload.websiteUrl ||
    requestPayload.businessCategoryId === undefined ||
    !requestPayload.description
  ) {
    return NextResponse.json({ error: 'Faltan campos requeridos en el payload.' }, { status: 400 });
  }

  // Generar una referencia única para BrightLocal
  const uniquePart = uuidv4().split('-')[0].substring(0, 8);
  const businessSlug = requestPayload.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 35);
  const brightLocalLocationReference = `loc-${businessSlug}-${uniquePart}`.substring(0,50);

  // --- Construir el payload para BrightLocal ---
  const brightLocalPayload: BrightLocalCreateLocationPayload = {
    business_name: requestPayload.businessName,
    location_reference: brightLocalLocationReference,
    country: requestPayload.countryCode,
    address: {
      address1: requestPayload.address1,
      address2: requestPayload.address2,
      region: requestPayload.stateProvince,
      region_code: requestPayload.regionCode,
      city: requestPayload.city,
      postcode: requestPayload.postalCode,
    },
    telephone: requestPayload.telephone,
    business_category_id: requestPayload.businessCategoryId,
    description: requestPayload.description,
    urls: {
      website_url: requestPayload.websiteUrl,
      menu_url: requestPayload.menuUrl,
      reservation_url: requestPayload.reservationUrl,
      order_url: requestPayload.orderUrl,
      gallery_url: requestPayload.galleryUrl,
      event_url: requestPayload.eventUrl,
    },
    contact: {
        first_name: requestPayload.contactFirstName,
        last_name: requestPayload.contactLastName,
        mobile: requestPayload.contactMobile,
        email: requestPayload.contactEmail,
        telephone: requestPayload.contactFax, // O el teléfono de contacto principal
    },
    num_employees: requestPayload.numberOfEmployees,
    opening_hours: requestPayload.openingHours,
    formation_date: requestPayload.formationDate,
    extra_business_category_ids: requestPayload.extraBusinessCategoryIds,
    geo_location: (requestPayload.latitude != null && requestPayload.longitude != null) ? { latitude: requestPayload.latitude, longitude: requestPayload.longitude } : undefined,
    payment_methods: requestPayload.paymentMethods,
    services_or_products: requestPayload.servicesOrProducts,
    timezone: requestPayload.timezone,
    is_service_area_business: requestPayload.isServiceAreaBusiness,
    language: requestPayload.languageCode,
    // client_id: mapear requestPayload.agencyClientId a un ID numérico si es necesario para BrightLocal
  };

  try {
    // 1. Crear la ubicación en BrightLocal
    const brightLocalResponse = await createLocationInBrightLocal(brightLocalPayload);

    if (!brightLocalResponse.success || !brightLocalResponse.location_id || brightLocalResponse.location_id === -1) {
      console.error('Falló la creación en BrightLocal:', brightLocalResponse.message || 'Respuesta inválida de BrightLocal', brightLocalResponse);
      return NextResponse.json(
        { error: 'Falló la creación de la ubicación en el proveedor externo.', details: brightLocalResponse.message || 'Error desconocido' },
        { status: 502 }
      );
    }

    // 2. Preparar datos para guardar en Supabase
    const supabaseLocationData: Partial<ClientLocationSupabaseRow> & { brightlocal_location_reference: string } = {
      client_id: requestPayload.agencyClientId,
      brightlocal_location_id: brightLocalResponse.location_id,
      brightlocal_location_reference: brightLocalLocationReference,
      business_name: requestPayload.businessName,
      description: requestPayload.description,
      phone_number: requestPayload.telephone,
      website_url: requestPayload.websiteUrl,
      brightlocal_business_category_id: requestPayload.businessCategoryId,
      extra_business_category_ids: requestPayload.extraBusinessCategoryIds,
      address_line1: requestPayload.address1,
      address_line2: requestPayload.address2,
      city: requestPayload.city,
      state_province: requestPayload.stateProvince,
      region_code: requestPayload.regionCode,
      postal_code: requestPayload.postalCode,
      country: requestPayload.countryCode,
      latitude: requestPayload.latitude,
      longitude: requestPayload.longitude,
      additional_urls: {
        website_url: requestPayload.websiteUrl,
        menu_url: requestPayload.menuUrl,
        reservation_url: requestPayload.reservationUrl,
        order_url: requestPayload.orderUrl,
        gallery_url: requestPayload.galleryUrl,
        event_url: requestPayload.eventUrl,
      },
      contact_main_first_name: requestPayload.contactFirstName,
      contact_main_last_name: requestPayload.contactLastName,
      contact_main_email: requestPayload.contactEmail,
      contact_main_phone: requestPayload.contactFax, // O el teléfono principal del contacto
      contact_main_mobile: requestPayload.contactMobile,
      number_of_employees: requestPayload.numberOfEmployees,
      opening_hours: requestPayload.openingHours,
      formation_date: requestPayload.formationDate,
      payment_methods: requestPayload.paymentMethods,
      services_or_products: requestPayload.servicesOrProducts,
      is_service_area_business: requestPayload.isServiceAreaBusiness,
      timezone: requestPayload.timezone,
      language_code: requestPayload.languageCode,
      is_active: true,
    };

    // 3. Guardar/Actualizar la ubicación en Supabase
    const savedLocation = await upsertSupabaseLocation(supabaseLocationData);

    if (!savedLocation) {
      console.error('CRÍTICO: Ubicación creada en BrightLocal pero falló al guardar en Supabase. BL ID:', brightLocalResponse.location_id, 'BL Ref:', brightLocalLocationReference);
      return NextResponse.json(
        { error: 'Ubicación creada externamente, pero falló la sincronización interna. Por favor, contacta a soporte.', brightLocalLocationId: brightLocalResponse.location_id },
        { status: 500 }
      );
    }

    return NextResponse.json(savedLocation, { status: 201 });

  } catch (error: any) {
    console.error('Error general en POST /api/seo-local-api/locations:', error);
    let errorMessage = 'Error interno del servidor.';
    if (error.message) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Error interno del servidor procesando la solicitud.', details: errorMessage }, { status: 500 });
  }
}

// Podrías añadir handlers para GET (listar ubicaciones), PUT (actualizar), DELETE aquí también.