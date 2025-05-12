// Podrías poner esto en un archivo separado, ej. components/AuditSkeletonLoader.tsx
// O directamente en tu page.tsx si prefieres
const AuditSkeletonLoader = () => {
    return (
      <div className="animate-pulse"> {/* Añade una animación de pulso simple de Tailwind */}
        {/* Esqueleto para los Tabs Mobile/Desktop */}
        <div className="flex justify-center mb-6 border-b border-gray-300 dark:border-gray-700">
          <div className="px-4 sm:px-6 py-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="px-4 sm:px-6 py-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
  
        {/* Esqueleto para el título de la estrategia */}
        <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mx-auto mb-6 sm:mb-8"></div>
  
        {/* Esqueleto para la URL analizada */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mx-auto mb-6 sm:mb-8"></div>
  
  
        {/* Esqueleto para los círculos de puntuación */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-750 shadow-md aspect-square">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mb-2">
                  {/* Podrías poner un círculo interior más oscuro si quieres */}
                </div>
                <div className="h-3.5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mt-1"></div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Esqueleto para Core Web Vitals */}
        <div className="my-10 sm:my-12">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-4 sm:mb-6"></div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-750 shadow space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/5"></div>
                </div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex justify-between text-xs text-transparent mt-0.5">
                    <span>0%</span><span>0%</span><span>0%</span> {/* Para mantener el espacio */}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Esqueleto para Diagnósticos */}
        <div className="mt-8 pt-5 pb-5 border-t border-gray-300 dark:border-gray-700 rounded-lg px-2 sm:px-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-5"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-750">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/5"></div>
                  <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };