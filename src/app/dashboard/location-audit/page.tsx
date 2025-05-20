"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, LoadScriptNext, useJsApiLoader } from '@react-google-maps/api';
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/Menu";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { BrightLocalBusinessCategoryItem } from '@/lib/seoLocalService/types'; // Asegúrate que la ruta sea correcta

// Interfaz para los datos del lugar seleccionado inicialmente por Google Autocomplete
interface SelectedPlaceData {
  name?: string;
  formattedAddress?: string; // formatted_address de Google
  phone?: string;
  googlePlaceId?: string;
  website?: string;
  // Para almacenar los componentes de dirección después de una llamada a Place Details
  addressComponents?: {
    street_number?: string;
    route?: string; // Nombre de la calle
    locality?: string; // Ciudad
    administrative_area_level_1?: string; // Estado/Provincia
    administrative_area_level_1_short?: string; // Código del Estado/Provincia (ej. CA)
    country?: string; // Nombre del país
    country_short?: string; // Código de país ISO 2 (ej. US)
    postal_code?: string;
  };
}

// Interfaz para todos los datos del formulario que se acumulan
interface FormDataForApi {
  // Datos iniciales de selectedPlace
  name?: string;
  formattedAddress?: string;
  phone?: string;
  googlePlaceId?: string;
  website?: string;

  // Datos parseados/completados para la API
  address1?: string; // Combinación de street_number y route
  address2?: string; // Opcional, no directamente de Google Places
  city?: string;
  stateProvince?: string;
  regionCode?: string; // Código de estado/provincia
  postalCode?: string;
  countryCode?: string; // ISO 3 (necesita conversión de ISO 2)

  // Datos adicionales requeridos por nuestra API y BrightLocal
  agencyClientId?: string;
  brightLocalBusinessCategoryId?: number;
  description?: string;
  
  // Otros campos opcionales de CreateLocationApiPayload que quieras recolectar
  menuUrl?: string;
  // ...etc.
}

// Payload que se envía a nuestra API de backend
// Es similar a CreateLocationApiPayload de la API Route
interface BackendApiPayload {
  agencyClientId: string;
  businessName: string;
  countryCode: string;
  address1: string;
  address2?: string;
  city?: string;
  stateProvince?: string;
  regionCode?: string;
  postalCode?: string;
  telephone: string;
  websiteUrl: string;
  businessCategoryId: number;
  description: string;
  menuUrl?: string;
  // ... otros campos
}


const LIBRARIES: ("places")[] = ['places'];

// Componente para el Paso 2 del formulario
const Step2Form = ({
  formData,
  setFormData,
  prevStep,
  onSubmit,
}: {
  formData: Partial<FormDataForApi>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<FormDataForApi>>>;
  prevStep: () => void;
  onSubmit: () => void;
}) => {
  const [categories, setCategories] = useState<BrightLocalBusinessCategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'brightLocalBusinessCategoryId' ? (value ? parseInt(value) : undefined) : value }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      // Determinar el código de país para buscar categorías.
      // Idealmente, formData.countryCode (ISO 3) ya está seteado.
      // Si solo tienes el nombre del país o ISO 2 de Google, necesitarás convertirlo.
      const countryForCategories = formData.countryCode || 'USA'; // Default o el país detectado

      if (countryForCategories) {
        setIsLoadingCategories(true);
        try {
          const response = await fetch(`/api/seo-local-api/sync-categories?country=${countryForCategories}`);
          const data = await response.json();
          if (response.ok && data.categories) {
            setCategories(data.categories);
          } else {
            console.error("Error al cargar categorías de BrightLocal:", data.error || data.message);
            alert(`No se pudieron cargar las categorías para ${countryForCategories}. Por favor, intenta con otro país o verifica la configuración.`);
            setCategories([]); // Limpiar categorías en caso de error
          }
        } catch (error) {
          console.error("Error de red al cargar categorías de BrightLocal:", error);
          alert("Error de red al cargar categorías.");
        } finally {
          setIsLoadingCategories(false);
        }
      }
    };
    fetchCategories();
  }, [formData.countryCode]); // Recargar si cambia el código de país en formData

  // Clases de ejemplo para inputs, reemplaza con tus estilos de Tailwind
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue focus:border-blue sm:text-sm text-gray-900 dark:text-gray-100";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-200";

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-6">
        Paso 2: Completa y Confirma los Detalles del Negocio
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nombre del Negocio *</label>
          <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label htmlFor="address1" className={labelClass}>Dirección Línea 1 *</label>
          <input type="text" name="address1" id="address1" value={formData.address1 || ''} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="address2" className={labelClass}>Dirección Línea 2</label>
          <input type="text" name="address2" id="address2" value={formData.address2 || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>Ciudad</label>
          <input type="text" name="city" id="city" value={formData.city || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="stateProvince" className={labelClass}>Estado/Provincia</label>
          <input type="text" name="stateProvince" id="stateProvince" value={formData.stateProvince || ''} onChange={handleChange} className={inputClass} />
        </div>
         <div>
          <label htmlFor="regionCode" className={labelClass}>Código de Región/Estado (ej. CA, TX)</label>
          <input type="text" name="regionCode" id="regionCode" value={formData.regionCode || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="postalCode" className={labelClass}>Código Postal</label>
          <input type="text" name="postalCode" id="postalCode" value={formData.postalCode || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="countryCode" className={labelClass}>Código de País (ISO 3) *</label>
          <input type="text" name="countryCode" id="countryCode" placeholder="Ej: USA, CAN, GBR" value={formData.countryCode || ''} onChange={handleChange} className={inputClass} maxLength={3} required />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Teléfono *</label>
          <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="website" className={labelClass}>Sitio Web *</label>
          <input type="url" name="website" id="website" value={formData.website || ''} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="brightLocalBusinessCategoryId" className={labelClass}>Categoría del Negocio (BrightLocal) *</label>
          {isLoadingCategories ? <p className="text-sm text-gray-500 dark:text-gray-400">Cargando categorías...</p> : (
            <select name="brightLocalBusinessCategoryId" id="brightLocalBusinessCategoryId" value={formData.brightLocalBusinessCategoryId || ''} onChange={handleChange} className={inputClass} required>
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
           {categories.length === 0 && !isLoadingCategories && formData.countryCode && <p className="text-xs text-red-500 mt-1">No se encontraron categorías para {formData.countryCode}. Verifica el código de país o intenta más tarde.</p>}
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Descripción del Negocio *</label>
          <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={4} className={inputClass} required></textarea>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="button-secondary px-6 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
          Anterior
        </button>
        <button type="button" onClick={onSubmit} className="button-main bg-blue hover:bg-dark-blue text-white px-6 py-2 text-sm font-medium rounded-md">
          Crear/Sincronizar Ubicación
        </button>
      </div>
    </div>
  );
};


export default function LocationAuditPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormDataForApi>>({});
  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<SelectedPlaceData | null>(null); // Para datos directos de Google
  const [inputValue, setInputValue] = useState('');
  
  const { isLoaded, loadError } = useJsApiLoader({ // Hook para cargar el script de Google
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    libraries: LIBRARIES,
  });

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Ya lo tenías, redundante con el hook

  // Función para convertir país ISO 2 a ISO 3 (simplificada)
  const convertCountryToISO3 = (iso2?: string): string | undefined => {
    if (!iso2) return undefined;
    const map: Record<string, string> = { US: 'USA', CA: 'CAN', GB: 'GBR', AU: 'AUS', /* ...añade más... */ };
    return map[iso2.toUpperCase()] || undefined; // Devuelve undefined si no hay mapeo
  };

  const extractAddressComponent = (components: google.maps.GeocoderAddressComponent[], type: string, useShortName = false): string | undefined => {
    const component = components.find(comp => comp.types.includes(type));
    return component ? (useShortName ? component.short_name : component.long_name) : undefined;
  };

  const onLoadAutocompleteInternal = useCallback((instance: google.maps.places.Autocomplete) => {
    setAutocompleteInstance(instance);
  }, []);

  const onPlaceChangedInternal = useCallback(() => {
    if (autocompleteInstance) {
      const place = autocompleteInstance.getPlace();
      console.log("Google Place Result:", place);

      if (place && place.place_id && place.name) {
        const newSelectedPlace: SelectedPlaceData = {
          name: place.name,
          formattedAddress: place.formatted_address,
          phone: place.formatted_phone_number,
          googlePlaceId: place.place_id,
          website: place.website,
        };

        let parsedAddress: Partial<FormDataForApi> = {};
        if (place.address_components) {
          const streetNumber = extractAddressComponent(place.address_components, 'street_number');
          const route = extractAddressComponent(place.address_components, 'route');
          
          parsedAddress = {
            address1: `${streetNumber || ''} ${route || ''}`.trim() || place.formatted_address?.split(',')[0], // Fallback básico
            city: extractAddressComponent(place.address_components, 'locality') || extractAddressComponent(place.address_components, 'postal_town'),
            stateProvince: extractAddressComponent(place.address_components, 'administrative_area_level_1'),
            regionCode: extractAddressComponent(place.address_components, 'administrative_area_level_1', true),
            postalCode: extractAddressComponent(place.address_components, 'postal_code'),
            countryCode: convertCountryToISO3(extractAddressComponent(place.address_components, 'country', true)),
          };
        } else {
          // Fallback si address_components no está (debería estar si pides 'geometry' o 'address_components' en fields)
          // o si el usuario escribe una dirección que no se resuelve a un Place completo.
          // Aquí podrías pedir al usuario que complete los campos manualmente en el Paso 2.
          console.warn("No se encontraron address_components. El usuario deberá completar la dirección.");
        }

        setSelectedPlaceDetails(newSelectedPlace);
        setInputValue(place.name);
        setFormData(prevData => ({
          ...prevData,
          name: newSelectedPlace.name,
          formattedAddress: newSelectedPlace.formattedAddress,
          phone: newSelectedPlace.phone,
          googlePlaceId: newSelectedPlace.googlePlaceId,
          website: newSelectedPlace.website,
          ...parsedAddress, // Fusionar los componentes de dirección parseados
        }));
      } else {
        setSelectedPlaceDetails(null);
      }
    }
  }, [autocompleteInstance]);

  const goToNextStep = () => {
    if (selectedPlaceDetails) {
      // Validaciones adicionales del Paso 1 antes de ir al Paso 2 si es necesario
      if (!formData.countryCode) {
        // Intenta parsear de nuevo o pide que se complete
        const parsed = parseFormattedAddress(formData.formattedAddress); // Necesitarías esta función
        if (parsed?.countryCode) {
            setFormData(prev => ({...prev, countryCode: parsed.countryCode}));
        } else {
            alert("No se pudo determinar el país. Por favor, ingrésalo en el siguiente paso.");
        }
      }
      console.log("Datos para el Paso 2:", formData);
      setCurrentStep(2);
    } else {
      alert("Por favor, busca y selecciona un negocio primero.");
    }
  };
  
  // Simulación de parseo de formatted_address (REEMPLAZAR CON LLAMADA A PLACE DETAILS Y PARSEO REAL)
  // Esta función es solo un ejemplo y NO ES ROBUSTA.
  const parseFormattedAddress = (formattedAddress?: string): Partial<FormDataForApi> => {
      if (!formattedAddress) return {};
      const parts = formattedAddress.split(',').map(p => p.trim());
      const result: Partial<FormDataForApi> = { address1: parts[0] };
      if (parts.length > 1) result.city = parts[1];
      if (parts.length > 2) {
          const stateZipCountry = parts[parts.length -2].split(' '); // Asume formato Ciudad, Estado CP, País
          if (stateZipCountry.length >= 2) {
              result.stateProvince = stateZipCountry.slice(0, -1).join(' '); // Todo menos el último es estado
              result.postalCode = stateZipCountry[stateZipCountry.length -1];
          } else {
              result.stateProvince = stateZipCountry.join(' ');
          }
      }
      if (parts.length > 3 || (parts.length === 3 && !result.postalCode) ) { // País podría ser la última parte
          result.countryCode = convertCountryToISO3(parts[parts.length -1]);
      }
      return result;
  };


  const goToPrevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmitToBackend = async () => {
    console.log("Enviando al backend:", formData);
    // Validaciones robustas aquí antes de enviar (usar Zod es ideal)
    if (!formData.name || !formData.countryCode || !formData.address1 || !formData.phone || !formData.website || !formData.brightLocalBusinessCategoryId || !formData.description) {
      alert("Faltan campos requeridos. Por favor, revisa el formulario.");
      return;
    }

    // Asumimos que agencyClientId se obtiene de algún lugar (ej. contexto de usuario, selección)
    // Para este ejemplo, lo hardcodearemos o lo tomarás de un estado si lo añades.
    const agencyClientId = formData.agencyClientId || "00000000-0000-0000-0000-000000000000"; // ¡REEMPLAZA ESTO!

    const payload: BackendApiPayload = {
      agencyClientId: agencyClientId,
      businessName: formData.name,
      countryCode: formData.countryCode,
      address1: formData.address1,
      address2: formData.address2,
      city: formData.city,
      stateProvince: formData.stateProvince,
      regionCode: formData.regionCode,
      postalCode: formData.postalCode,
      telephone: formData.phone,
      websiteUrl: formData.website,
      businessCategoryId: formData.brightLocalBusinessCategoryId,
      description: formData.description,
      menuUrl: formData.menuUrl,
      // ... mapea otros campos opcionales de formData
    };

    try {
      const response = await fetch('/api/seo-local-api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok) {
        alert(`Ubicación procesada! Detalles: ${JSON.stringify(result)}`);
        setCurrentStep(1); // Volver al inicio o a un paso de éxito
        setFormData({});
        setSelectedPlaceDetails(null);
        setInputValue('');
      } else {
        alert(`Error del servidor: ${result.error || 'Error desconocido'}. Detalles: ${result.details || JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error("Error al enviar al backend:", error);
      alert("Error de red al procesar la solicitud.");
    }
  };


  if (loadError) {
    console.error("Error al cargar Google Maps Script con useJsApiLoader:", loadError);
    // Muestra un mensaje de error más permanente si el hook falla
  }
  
  // Placeholder para agencyClientId
  useEffect(() => {
    // En una app real, obtendrías esto del usuario logueado o un selector
    setFormData(prev => ({ ...prev, agencyClientId: "tu-uuid-de-agency-client-aqui" }));
  }, []);


  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header"><TopNavTwo /><MenuOne /></header>
        <main className="content py-10 md:py-16">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-3">
                Auditoría de Ubicaciones
              </h1>
            </div>

            {currentStep === 1 && (
              <>
                <p className="text-center text-secondary dark:text-gray-300 text-base sm:text-lg mb-8">
                  Paso 1 de 2: Encuentra el negocio para cargar o verificar sus datos.
                </p>
                {!googleMapsApiKey && (
                  <div className="text-center my-8 p-4 rounded-md bg-red-100 border border-red-300 max-w-xl mx-auto">
                    <Icon.WarningCircle size={48} className="text-red-500 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Error de Configuración</h3>
                    <p className="text-red-700 text-base">La API Key de Google no está disponible.</p>
                  </div>
                )}
                {googleMapsApiKey && !isLoaded && !loadError && (
                   <div className="text-center py-10">
                    <Icon.SpinnerGap size={48} className="animate-spin text-blue-500 mx-auto" />
                    <p className="text-secondary dark:text-gray-400 mt-2">Cargando herramientas de búsqueda...</p>
                  </div>
                )}
                {loadError && (
                    <div className="text-center my-8 p-4 rounded-md bg-red-100 border border-red-300 max-w-xl mx-auto">
                        <Icon.WarningCircle size={48} className="text-red-500 mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-red-600 mb-2">Error de Carga</h3>
                        <p className="text-red-700 text-base">No se pudo cargar el script de Google Maps. Verifica la API Key y la conexión.</p>
                    </div>
                )}
                {isLoaded && (
                  <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                      <label htmlFor="autocomplete-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Buscar Negocio:
                      </label>
                      <Autocomplete
                        onLoad={onLoadAutocompleteInternal}
                        onPlaceChanged={onPlaceChangedInternal}
                        options={{
                          types: ['establishment'],
                          // Pide address_components para un mejor parseo
                          fields: ['place_id', 'name', 'formatted_address', 'formatted_phone_number', 'website', 'address_components', 'geometry'],
                        }}
                      >
                        <input
                          id="autocomplete-input"
                          type="text"
                          placeholder="Escribe el nombre o dirección del negocio..."
                          value={inputValue}
                          onChange={(e) => {
                            setInputValue(e.target.value);
                            if (selectedPlaceDetails) setSelectedPlaceDetails(null); // Limpiar si el usuario escribe de nuevo
                          }}
                          className="flex-grow w-full caption11 bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent"
                        />
                      </Autocomplete>
                    </div>

                    {selectedPlaceDetails && (
                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-4">
                          Datos del Negocio Encontrado
                        </h2>
                        <div className="space-y-3">
                          {/* ... mostrar selectedPlaceDetails.name, .address, .phone, .website ... */}
                           {selectedPlaceDetails.name && <p><strong>Nombre:</strong> {selectedPlaceDetails.name}</p>}
                           {selectedPlaceDetails.formattedAddress && <p><strong>Dirección:</strong> {selectedPlaceDetails.formattedAddress}</p>}
                           {selectedPlaceDetails.phone && <p><strong>Teléfono:</strong> {selectedPlaceDetails.phone}</p>}
                           {selectedPlaceDetails.website && <p><strong>Sitio Web:</strong> <a href={selectedPlaceDetails.website} target="_blank" rel="noopener noreferrer">{selectedPlaceDetails.website}</a></p>}
                        </div>
                        <button
                          onClick={goToNextStep}
                          disabled={!selectedPlaceDetails}
                          className={`button-main text-white text-base font-medium rounded-full px-8 py-3 w-full sm:w-auto transition-colors duration-150 ease-in-out mt-8 flex items-center justify-center gap-2 ${
                            !selectedPlaceDetails
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          Siguiente Paso <Icon.ArrowRight size={20} weight="bold" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {currentStep === 2 && (
              <Step2Form
                formData={formData}
                setFormData={setFormData}
                prevStep={goToPrevStep}
                onSubmit={handleSubmitToBackend}
              />
            )}
            
            {/* Aquí podrías tener un currentStep === 3 para un mensaje de éxito o resumen final */}

          </div>
        </main>
        <footer id="footer"><Footer /></footer>
      </div>
    </>
  );
}