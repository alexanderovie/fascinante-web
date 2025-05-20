import { createServerClient, type CookieOptions } from "@supabase/ssr" // Deberías importar CookieOptions si usas las funciones set/remove individuales
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request, // Es importante pasar el request original aquí
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // La implementación de cookies aquí es un poco diferente a la que te mostré antes.
        // La que has implementado es más acorde con los ejemplos más recientes de Supabase,
        // usando getAll y setAll, lo cual es bueno.
        get(name: string) { // Necesitarías 'get' y 'remove' si no usas 'getAll'/'setAll'
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) { // Necesitarías 'set'
          request.cookies.set({ name, value, ...options })
          supabaseResponse = NextResponse.next({ // Re-crear la respuesta para asegurar que los headers se propaguen
            request,
          })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) { // Necesitarías 'remove'
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse = NextResponse.next({ // Re-crear la respuesta
            request,
          })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // Este comentario es crucial y correcto.

  const {
    data: { user },
  } = await supabase.auth.getUser() // Reemplaza a getSession() para obtener el usuario directamente y refrescar si es necesario.

  // Lógica de redirección si el usuario no está autenticado y no está en una página pública/de autenticación:
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") && // Asumiendo que '/login' es tu página de login
    !request.nextUrl.pathname.startsWith("/auth") // Asumiendo que '/auth' es para callbacks u otras rutas de auth
    // Añade aquí otras rutas públicas que no requieran autenticación
    // Ejemplo: !request.nextUrl.pathname.startsWith("/public-page")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/login" // Redirige a tu página de login
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is...
  // Este comentario también es vital y correcto.

  return supabaseResponse
}