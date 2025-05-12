


// src/app/dashboard/location-audit/page.tsx
"use client";

// src/app/dashboard/location-audit/page.tsx
"use client";

import React, { useState } from 'react'; // CORREGIDO: Añadido 'from 'react';'
import { Autocomplete, LoadScriptNext } from '@react-google-maps/api';
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";

// Interfaz para los datos del lugar seleccionado
interface SelectedPlaceData {
  name?: string;
  address?: string;
  phone?: string;
  googlePlaceId?: string;
  website?: string; 
}

const LIBRARIES: ("places")[] = ['places'];


export default function LocationAuditPage() {
  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlaceData | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(true); // Para el estado de carga del script de Google

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const onLoadAutocomplete = (instance: google.maps.places.Autocomplete) => {
    setAutocompleteInstance(instance);
  };

  const onPlaceChanged = () => {
    if (autocompleteInstance) {
      const place = autocompleteInstance.getPlace();
      if (place && place.place_id) {
        setSelectedPlace({
          name: place.name,
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          googlePlaceId: place.place_id,
          website: place.website,
        });
        setInputValue(place.name || '');
      } else {
        setSelectedPlace(null);
      }
    }
  };

  const handleNextStep = () => {
    if (selectedPlace) {
      console.log("Continuar al siguiente paso con:", selectedPlace);
      // Lógica futura:
      // 1. Verificar en Supabase si existe `selectedPlace.googlePlaceId`.
      // 2. Si sí, cargar datos. Si no, usar `selectedPlace` para pre-llenar.
      alert(`Simulación: Siguiente paso con ${selectedPlace.name}`);
    } else {
      alert("Por favor, busca y selecciona un negocio primero.");
    }
  };

  // Manejo del error de API Key de forma más integrada
  if (!googleMapsApiKey && process.env.NODE_ENV !== 'production') { // Solo muestra error detallado en desarrollo
    console.error("Error: NEXT_PUBLIC_GOOGLE_API_KEY no está configurada.");
  }


  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header"><TopNavTwo /><MenuOne /></header>
        <main className="content py-10 md:py-16">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"> {/* Contenedor principal, max-w ajustado */}

            <div className="text-center mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-3">
                Auditoría de Ubicaciones
              </h1>
              <p className="text-secondary dark:text-gray-300 text-base sm:text-lg">
                Paso 1 de X: Encuentra el negocio para cargar o verificar sus datos.
              </p>
            </div>

            {!googleMapsApiKey && ( // Mostrar error si la API key no está en producción
                 <div className="text-center my-8 p-4 rounded-md bg-critical/10 border border-critical/30 max-w-xl mx-auto">
                    <Icon.WarningCircle size={48} className="text-critical mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-critical mb-2">Error de Configuración</h3>
                    <p className="text-critical/90 text-base">La API Key de Google no está disponible. Por favor, contacta al administrador.</p>
                </div>
            )}

            {googleMapsApiKey && (
              <LoadScriptNext
                googleMapsApiKey={googleMapsApiKey}
                libraries={LIBRARIES}
                onLoad={() => setIsLoadingGoogle(false)}
                loadingElement={
                  <div className="text-center py-10">
                    <Icon.SpinnerGap size={48} className="animate-spin text-blue mx-auto" />
                    <p className="text-secondary dark:text-gray-400 mt-2">Cargando herramientas de búsqueda...</p>
                  </div>
                }
                onError={() => {
                  console.error("Error al cargar Google Maps Script");
                  // Podrías setear un estado de error aquí para mostrar un mensaje al usuario
                }}
              >
                {isLoadingGoogle ? null : ( // Solo renderiza el Autocomplete si el script se cargó
                  <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                      <label htmlFor="autocomplete-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Buscar Negocio:
                      </label>
                      <Autocomplete
                        onLoad={onLoadAutocomplete}
                        onPlaceChanged={onPlaceChanged}
                        options={{
                          types: ['establishment'],
                          fields: ['place_id', 'name', 'formatted_address', 'formatted_phone_number', 'website', 'geometry'], // Campos esenciales
                          // componentRestrictions: { country: 'US' }, // Ejemplo: Restringir a un país
                        }}
                      >
                        <input
                          id="autocomplete-input"
                          type="text"
                          placeholder="Escribe el nombre o dirección del negocio..."
                          value={inputValue}
                          onChange={(e) => {
                            setInputValue(e.target.value);
                            if (selectedPlace) setSelectedPlace(null); // Limpiar selección si el usuario escribe de nuevo
                          }}
                          className="flex-grow w-full bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 text-base px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent"
                        />
                      </Autocomplete>
                    </div>

                    {selectedPlace && (
                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-4">
                          Datos del Negocio Encontrado
                        </h2>
                        <div className="space-y-3">
                          {selectedPlace.name && (
                            <p className="text-secondary dark:text-gray-300">
                              <strong className="text-black dark:text-white">Nombre:</strong> {selectedPlace.name}
                            </p>
                          )}
                          {selectedPlace.address && (
                            <p className="text-secondary dark:text-gray-300">
                              <strong className="text-black dark:text-white">Dirección:</strong> {selectedPlace.address}
                            </p>
                          )}
                          {selectedPlace.phone && (
                            <p className="text-secondary dark:text-gray-300">
                              <strong className="text-black dark:text-white">Teléfono:</strong> {selectedPlace.phone}
                            </p>
                          )}
                          {selectedPlace.website && (
                            <p className="text-secondary dark:text-gray-300">
                              <strong className="text-black dark:text-white">Sitio Web:</strong>
                              <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer" className="text-blue dark:text-blue-400 hover:underline ml-1">
                                {selectedPlace.website}
                              </a>
                            </p>
                          )}
                          {selectedPlace.googlePlaceId && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                              ID de Google Place: {selectedPlace.googlePlaceId}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={handleNextStep}
                          disabled={!selectedPlace} // Deshabilitar si no hay lugar seleccionado
                          className={`button-main text-white text-base font-medium rounded-full px-8 py-3 w-full sm:w-auto transition-colors duration-150 ease-in-out mt-8 flex items-center justify-center gap-2 ${
                            !selectedPlace
                              ? 'bg-grey hover:bg-grey cursor-not-allowed dark:bg-gray-500 dark:hover:bg-gray-500'
                              : 'bg-blue hover:bg-dark-blue dark:bg-blue-600 dark:hover:bg-blue-700'
                          }`}
                        >
                          Siguiente Paso <Icon.ArrowRight size={20} weight="bold" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </LoadScriptNext>
            )}
          </div>
        </main>
        <footer id="footer"><Footer /></footer>
      </div>
    </>
  );
}