// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link href="/">
        Volver al Inicio
      </Link>
    </div>
  )
}