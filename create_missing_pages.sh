#!/bin/bash

# Directorio base donde se encuentran tus rutas de la aplicación
APP_DIR="src/app"

# Array con las rutas rotas (sin el dominio)
declare -a BROKEN_PATHS=(
    "terms-of-services"
    "services/web-audit"
    "services/social-media"
    "services/seo-optimization"
    "services/directory-listing"
    "services/content-creation"
    "services/contact-style-one.html" # Esto creará una carpeta llamada contact-style-one.html
    "service/service-detail/website-maintenance"
    "service/service-detail/ux-ui-design"
    "service/service-detail/targeted-paid-advertising"
    "service/service-detail/responsive-development"
    "case-studies/real-estate"
)

# Contenido básico para los nuevos archivos page.tsx
# Puedes personalizar este contenido si lo deseas.
PAGE_CONTENT='// Página de marcador de posición generada automáticamente
export default function Page() {
  return (
    <div>
      <h1>Contenido Pendiente</h1>
      <p>Esta página necesita ser desarrollada.</p>
      <p>Ruta: { /* Intenta mostrar la ruta actual si es posible o un identificador */}</p>
    </div>
  );
}'

# Asegúrate de estar en el directorio raíz del proyecto
# cd /ruta/a/tu/proyecto/fascinante-web # Descomenta y ajusta si es necesario

# Recorre cada ruta y crea la estructura
for path_segment in "${BROKEN_PATHS[@]}"; do
    full_dir_path="$APP_DIR/$path_segment"
    page_file_path="$full_dir_path/page.tsx"

    echo "Creando directorio: $full_dir_path"
    mkdir -p "$full_dir_path"

    if [ ! -f "$page_file_path" ]; then
        echo "Creando archivo: $page_file_path"
        echo "$PAGE_CONTENT" > "$page_file_path"
        # Podrías añadir una referencia a la ruta en el contenido, por ejemplo:
        # temp_content="${PAGE_CONTENT//\{\/\* \Intenta mostrar la ruta actual \*\/\}/$path_segment}"
        # echo "$temp_content" > "$page_file_path"
    else
        echo "El archivo $page_file_path ya existe. No se sobrescribirá."
    fi
    echo "---"
done

echo "Proceso completado. Se han creado las estructuras y archivos page.tsx de marcador de posición."