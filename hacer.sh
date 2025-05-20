#!/bin/bash

# --- LIMPIEZA PROFUNDA DE DIRECTORIOS BASURA ---
echo "Directorio actual: $(pwd)"
echo "Revisa cuidadosamente la siguiente lista de directorios a eliminar:"
echo "--------------------------------------------------------------------"
DIRS_TO_DELETE=(
    "src/app/api/seo-local-api/rankings/tracker"
    "src/app/api/seo-local-api/rankings/[keywordId]/tracker"
    "src/app/api/seo-local-api/audits/[auditId]"
    "src/app/api/seo-local-api/listings/management"
)
for dir in "${DIRS_TO_DELETE[@]}"; do
    echo "- $dir"
done
echo "--------------------------------------------------------------------"
read -r -p "Si estás de acuerdo y en el directorio correcto, escribe 'SI' y presiona Enter para eliminar estos directorios: " CONFIRMACION
if [ "$CONFIRMACION" = "SI" ]; then
    echo "Procediendo con la eliminación..."
    for dir in "${DIRS_TO_DELETE[@]}"; do
        rm -rf "$dir"
        echo "Eliminado: $dir"
    done
    echo "Limpieza de directorios basura completada."
else
    echo "Eliminación cancelada por el usuario."
fi

# --- VERIFICACIÓN Y CREACIÓN MÍNIMA DE ESTRUCTURA ---
DIRS_TO_CREATE=(
    "src/app/api/seo-local-api/audits/[auditId]"
    "src/app/api/seo-local-api/listings/management"
    "src/app/api/seo-local-api/rankings/[keywordId]/tracker"
    "src/lib/seoLocalService"
)

FILES_TO_CREATE=(
    "src/app/api/seo-local-api/audits/route.ts"
    "src/app/api/seo-local-api/audits/[auditId]/route.ts"
    "src/app/api/seo-local-api/listings/route.ts"
    "src/app/api/seo-local-api/listings/management/route.ts"
    "src/app/api/seo-local-api/rankings/route.ts"
    "src/app/api/seo-local-api/rankings/[keywordId]/tracker/route.ts"
    "src/lib/seoLocalService/client.ts"
    "src/lib/seoLocalService/auditService.ts"
    "src/lib/seoLocalService/listingService.ts"
    "src/lib/seoLocalService/rankingService.ts"
    "src/lib/seoLocalService/types.ts"
    "src/lib/seoLocalService/utils.ts"
    "src/lib/seoLocalService/index.ts"
)

echo "Creando directorios necesarios..."
for dir in "${DIRS_TO_CREATE[@]}"; do
    mkdir -p "$dir"
    echo "Directorio creado: $dir"
done

echo "Creando archivos necesarios..."
for file in "${FILES_TO_CREATE[@]}"; do
    touch "$file"
    echo "Archivo creado: $file"
done

echo "Script de corrección finalizado."
echo "Verifica la estructura con 'tree src' para ver solo el contenido de la carpeta src."