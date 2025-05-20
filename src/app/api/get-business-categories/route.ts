// src/app/api/get-business-categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Importa directamente de @supabase/ssr

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('country_code');

  if (!countryCode) {
    return NextResponse.json({ error: 'Country code is required' }, { status: 400 });
  }

  // Crear el cliente Supabase PARA ESTE Route Handler
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Usar anon key para data pública es común
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Para un GET, set no es usualmente necesario, pero es parte del patrón
          // request.cookies.set({ name, value, ...options }); // Esto modificaría las cookies entrantes, no las salientes
          // Para establecer cookies en la respuesta, necesitarías modificar el objeto NextResponse
        },
        remove(name: string, options: CookieOptions) {
          // similar a set
          // request.cookies.delete({ name, ...options });
        },
      },
    }
  );

  try {
    const { data: categories, error } = await supabase
      .from('brightlocal_business_categories')
      .select('id, name')
      .eq('country_code', countryCode)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories from Supabase in API Route:', error);
      return NextResponse.json({ error: error.message || 'Database query failed' }, { status: 500 });
    }

    return NextResponse.json(categories || []);
  } catch (error: any) {
    console.error('Fallback catch error in API get-business-categories route:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch business categories' }, { status: 500 });
  }
}