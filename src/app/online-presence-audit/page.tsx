// src/app/online-presence-audit/page.tsx
'use client';

import { useState, FormEvent, useEffect, useRef, useCallback, Fragment } from 'react';
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/Menu"; // O MenuTwo si es el correcto
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Combobox, Dialog, Transition } from '@headlessui/react';

// --- Interfaces ---
interface BusinessNAP {
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  googleCountryCode?: string;
}

interface BusinessFormData {
  searchQuery: string;
  selectedBusinessName?: string;
  locationReference?: string;
  countryCode?: string; // ISO3 (ej. USA)
  googleCountryCode?: string; // ISO2 (ej. US)
  postalCode?: string;
  streetAddressLine1?: string;
  streetAddressLine2?: string;
  city?: string;
  region?: string; // Nombre completo del estado/región
  regionCode?: string; // Código del estado/región
  phone?: string;
  website?: string;
  googlePlaceId?: string;
  businessCategoryId?: number | string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

interface BrightLocalCategory {
  id: number;
  name: string;
}

interface SubmissionStatus {
    success: boolean;
    message: string;
    locationId?: string | number;
}

const LIBRARIES_PLACES: ("places")[] = ["places"];

export default function OnlinePresenceAuditPage() {
  const [formData, setFormData] = useState<Partial<BusinessFormData>>({
    searchQuery: '',
    countryCode: 'USA',
  });
  const [selectedNAP, setSelectedNAP] = useState<BusinessNAP | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null);
  
  const [businessCategories, setBusinessCategories] = useState<BrightLocalCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState('');

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [dataPayloadForConfirmation, setDataPayloadForConfirmation] = useState<any | null>(null);
  const [curlForConfirmation, setCurlForConfirmation] = useState<string | null>(null);

  // Log para ver el estado del modal en cada render
  // console.log("OnlinePresenceAuditPage RENDER. isConfirmModalOpen:", isConfirmModalOpen);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    libraries: LIBRARIES_PLACES,
  });

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps API failed to load:", loadError);
      setError("Could not connect to Google Places service. Please try refreshing or check the API key.");
    }
  }, [loadError]);

  const mapCountryCodeToISO3 = useCallback((iso2?: string): string | undefined => {
    if (!iso2) return undefined;
    const map: Record<string, string> = {
      US: 'USA', CA: 'CAN', GB: 'GBR', AU: 'AUS', DE: 'DEU', HK: 'HKG',
      IE: 'IRL', MO: 'MAC', NL: 'NLD', NZ: 'NZL', PH: 'PHL', SG: 'SGP',
      TW: 'TWN', ZA: 'ZAF',
    };
    const upperIso2 = iso2.toUpperCase();
    return map[upperIso2] || upperIso2;
  }, []);

  useEffect(() => {
    const countryToFetch = formData.countryCode;
    const currentCategoryId = formData.businessCategoryId;

    if (typeof countryToFetch === 'string' && countryToFetch.length === 3) {
      setIsLoadingCategories(true);
      setBusinessCategories([]);
      setCategoryQuery(''); 
      fetch(`/api/get-business-categories?country_code=${countryToFetch}`)
        .then(res => {
            if (!res.ok) {
                return res.json().then(errData => {
                    throw new Error(errData.error || `Failed to fetch categories (status ${res.status})`);
                });
            }
            return res.json();
        })
        .then((data: BrightLocalCategory[] | {error: string}) => {
          if (Array.isArray(data)) {
            setBusinessCategories(data);
            const currentCategoryIdNum = typeof currentCategoryId === 'string' ? parseInt(currentCategoryId) : currentCategoryId;
            const selectedCategoryExists = data.some(cat => cat.id === currentCategoryIdNum);
            
            if (currentCategoryIdNum !== undefined && !selectedCategoryExists) {
                setFormData(prev => ({ ...prev, businessCategoryId: undefined }));
                setCategoryQuery('');
            } else if (selectedCategoryExists) {
                const selectedCat = data.find(cat => cat.id === currentCategoryIdNum);
                if (selectedCat) setCategoryQuery(selectedCat.name);
            }
          } else {
            console.error("Error data structure from /api/get-business-categories:", data);
            setBusinessCategories([]);
            setCategoryQuery('');
          }
        })
        .catch(err => {
          console.error("Failed to fetch categories (useEffect catch):", err);
          setBusinessCategories([]);
          setCategoryQuery('');
        })
        .finally(() => setIsLoadingCategories(false));
    } else {
      setBusinessCategories([]);
      setCategoryQuery('');
    }
  }, [formData.countryCode, formData.businessCategoryId]);


  const handleCategorySelected = (selectedCategory: BrightLocalCategory | null) => {
    setFormData(prev => ({
        ...prev,
        businessCategoryId: selectedCategory ? selectedCategory.id : undefined,
    }));
    setCategoryQuery(selectedCategory ? selectedCategory.name : ''); 
    setError(null);
    setSubmissionStatus(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newState: Partial<BusinessFormData> = { ...prev };
        (newState as any)[name] = value;
        return newState;
    });
    setError(null);
    setSubmissionStatus(null);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFormData(prev => ({
        ...prev,
        searchQuery: query,
        selectedBusinessName: (query === prev.selectedBusinessName && query !== "") ? prev.selectedBusinessName : undefined,
        googlePlaceId: (query === prev.selectedBusinessName && query !== "") ? prev.googlePlaceId : undefined,
        streetAddressLine1: (query === prev.selectedBusinessName && query !== "") ? prev.streetAddressLine1 : undefined,
        city: (query === prev.selectedBusinessName && query !== "") ? prev.city : undefined,
        region: (query === prev.selectedBusinessName && query !== "") ? prev.region : undefined,
        regionCode: (query === prev.selectedBusinessName && query !== "") ? prev.regionCode : undefined,
        postalCode: (query === prev.selectedBusinessName && query !== "") ? prev.postalCode : undefined,
        googleCountryCode: (query === prev.selectedBusinessName && query !== "") ? prev.googleCountryCode : undefined,
        phone: (query === prev.selectedBusinessName && query !== "") ? prev.phone : undefined,
        website: (query === prev.selectedBusinessName && query !== "") ? prev.website : undefined,
        latitude: (query === prev.selectedBusinessName && query !== "") ? prev.latitude : undefined,
        longitude: (query === prev.selectedBusinessName && query !== "") ? prev.longitude : undefined,
    }));
    if (query === "" || (formData.selectedBusinessName && query !== formData.selectedBusinessName) ) {
        setSelectedNAP(null);
    }
    setError(null);
    setSubmissionStatus(null);
  };

  const generateLocationReference = (name?: string, city?: string): string => {
    if (!name) return `loc-ref-${Date.now().toString().slice(-7)}`;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const citySlug = city ? city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0,10) : '';
    const ref = citySlug ? `${slug.substring(0,25)}-${citySlug}` : slug.substring(0,35);
    return ref.substring(0, 44) + `-${Date.now().toString().slice(-5)}`;
  };

  const onLoadAutocomplete = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteInstance(autocomplete);
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteInstance !== null) {
      const place = autocompleteInstance.getPlace();
      if (place && place.name && place.place_id && place.address_components) {
        let streetNumber = ''; let route = ''; let city = '';
        let stateName = ''; let stateCode = ''; let postalCode = '';
        let googleIso2CountryCode = '';
        let fullAddress = place.formatted_address || '';

        place.address_components.forEach(component => {
          const types = component.types;
          if (types.includes('street_number')) streetNumber = component.long_name;
          if (types.includes('route')) route = component.long_name;
          if (types.includes('locality') || types.includes('postal_town')) city = component.long_name;
          if (types.includes('administrative_area_level_1')) { stateName = component.long_name; stateCode = component.short_name; }
          if (types.includes('postal_code')) postalCode = component.long_name;
          if (types.includes('country')) googleIso2CountryCode = component.short_name;
        });

        const addressLine1 = `${streetNumber} ${route}`.trim();
        const locationRef = generateLocationReference(place.name, city);
        const brightLocalIso3CountryCode = mapCountryCodeToISO3(googleIso2CountryCode);

        setFormData(prev => ({
          ...prev,
          searchQuery: place.name || '',
          selectedBusinessName: place.name, locationReference: locationRef,
          streetAddressLine1: addressLine1, city: city, region: stateName, regionCode: stateCode,
          postalCode: postalCode, countryCode: brightLocalIso3CountryCode,
          googleCountryCode: googleIso2CountryCode, phone: place.formatted_phone_number,
          website: place.website, googlePlaceId: place.place_id,
          latitude: place.geometry?.location?.lat(), longitude: place.geometry?.location?.lng(),
        }));
        setSelectedNAP({
          name: place.name, address: fullAddress, phone: place.formatted_phone_number,
          website: place.website, googleCountryCode: googleIso2CountryCode,
        });
        setError(null); setSubmissionStatus(null);
      } else {
        const currentSearch = formData.searchQuery || "";
        setFormData(prev => ({
            ...prev, searchQuery: currentSearch, selectedBusinessName: undefined,
            locationReference: generateLocationReference(currentSearch),
            streetAddressLine1: undefined, streetAddressLine2: undefined, city: undefined,
            region: undefined, regionCode: undefined, postalCode: undefined,
            googleCountryCode: undefined, phone: undefined, website: undefined,
            googlePlaceId: undefined, latitude: undefined, longitude: undefined,
        }));
        setSelectedNAP(null);
      }
    }
  };

  const prepareForLocationSetup = () => {
    console.log("%cFUNC: prepareForLocationSetup CALLED", "color: orange; font-weight: bold;"); // LOG
    console.log("FORM DATA for preparation:", JSON.stringify(formData, null, 2)); // LOG
    
    const {
        selectedBusinessName, searchQuery, businessCategoryId, description,
        countryCode, locationReference, streetAddressLine1, streetAddressLine2,
        city, region, regionCode, postalCode, phone, website, latitude, longitude
    } = formData;

    if (!selectedBusinessName && !(searchQuery && searchQuery.trim() !== '')) {
        console.error("VALIDATION FAIL (prepare): Business name missing."); // LOG
        setError("Please enter or select a business name."); return;
    }
    if (!businessCategoryId) {
        console.error("VALIDATION FAIL (prepare): Category ID missing."); // LOG
        setError("Please select a business category."); return;
    }
    if (!description || description.trim() === "") {
        console.error("VALIDATION FAIL (prepare): Description missing."); // LOG
        setError("Please enter a business description."); return;
    }
    const blCountryCode = countryCode;
    if (!blCountryCode || blCountryCode.length !== 3) {
      console.error(`VALIDATION FAIL (prepare): Invalid country code. Current: '${blCountryCode || 'Not set'}'`); // LOG
      setError(`A valid 3-letter country code (e.g., USA) is required. Current: '${blCountryCode || 'Not set'}'`);
      return;
    }
    
    console.log("All validations passed in prepareForLocationSetup."); // LOG
    setError(null);

    const businessNameToUse = selectedBusinessName || (searchQuery ? searchQuery.trim() : '');
    const locationReferenceToUse = locationReference || generateLocationReference(businessNameToUse, city);

    const payload: any = {
      business_name: businessNameToUse, location_reference: locationReferenceToUse,
      country: blCountryCode.toUpperCase(),
      address: {
        address1: streetAddressLine1 || "", city: city || "",
        postcode: postalCode || "", region: region || "",
      },
      telephone: phone || "",
      business_category_id: parseInt(String(businessCategoryId)),
      description: description.trim(),
    };
    if (streetAddressLine2) payload.address.address2 = streetAddressLine2;
    if (regionCode) payload.address.region_code = regionCode;
    if (website) payload.urls = { website_url: website };
    if (latitude && longitude) payload.geo_location = { latitude, longitude };

    setDataPayloadForConfirmation(payload);

    const curlCommand = `curl --request POST \\
  --url https://api.brightlocal.com/manage/v1/locations \\
  --header 'Accept: application/json' \\
  --header 'Content-Type: application/json' \\
  --header 'x-api-key: YOUR_ACTUAL_API_KEY_PLACEHOLDER' \\
  --data '${JSON.stringify(payload, null, 2)}'`;
    setCurlForConfirmation(curlCommand);

    console.log("%cAttempting to open confirmation modal...", "color: purple; font-weight: bold;"); // LOG
    setIsConfirmModalOpen(true);
  };

  const confirmAndSubmitProfile = async () => {
    if (!dataPayloadForConfirmation) {
        console.error("CONFIRM SUBMIT FAIL: dataPayloadForConfirmation is missing."); // LOG
        setError("Data payload is missing for submission.");
        setIsConfirmModalOpen(false);
        return;
    }

    setIsConfirmModalOpen(false);
    setIsSubmittingProfile(true);
    setError(null);
    setSubmissionStatus(null);
    console.log("%cCONFIRMED: Submitting profile with payload:", "color: blue; font-weight: bold;", JSON.stringify(dataPayloadForConfirmation, null, 2));

    try {
      console.log("Attempting fetch to /api/create-location-profile"); // LOG
      const response = await fetch('/api/create-location-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayloadForConfirmation),
      });
      console.log("API response status:", response.status); // LOG
      const result = await response.json();
      console.log("API response data:", result); // LOG

      if (!response.ok) {
        console.error("API call failed with status:", response.status, "Result:", result); // LOG
        throw new Error(result.error || `Failed to create location profile (HTTP ${response.status})`);
      }
      setSubmissionStatus({ success: true, message: result.message || 'Location Profile initiated successfully!', locationId: result.location_id });
      console.log("Profile creation successful:", result); // LOG
    } catch (err: any) {
      console.error("Error in confirmAndSubmitProfile's try-catch:", err); // LOG
      setError(err.message || 'An unexpected error occurred.');
      setSubmissionStatus({ success: false, message: err.message || 'An unexpected error occurred.' });
    } finally {
      console.log("Setting isSubmittingProfile to false in confirmAndSubmitProfile"); // LOG
      setIsSubmittingProfile(false);
      setDataPayloadForConfirmation(null); 
    }
  };

  const closeModal = () => {
    console.log("Closing modal."); // LOG
    setIsConfirmModalOpen(false);
    setDataPayloadForConfirmation(null);
    setCurlForConfirmation(null);
  };

  const copyCurlToClipboard = () => {
    if (curlForConfirmation) {
      navigator.clipboard.writeText(curlForConfirmation)
        .then(() => { alert("cURL command copied to clipboard!"); })
        .catch(err => { 
            console.error("Failed to copy cURL command: ", err);
            alert("Error: Could not copy cURL command. See console for details.");
        });
    } else {
      alert("No cURL command generated yet to copy.");
    }
  };

  const filteredCategories =
    categoryQuery === ''
      ? businessCategories
      : businessCategories.filter((category) =>
          category.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(categoryQuery.toLowerCase().replace(/\s+/g, ''))
        );

  const renderStepOne = () => {
    // Descomenta estos logs si necesitas depurar por qué el botón principal está deshabilitado
    // console.log("--- Button Disabled Check (renderStepOne) ---");
    // console.log("isLoaded (Google API):", isLoaded);                     
    // console.log("isLoadingCategories:", isLoadingCategories);           
    // console.log("isSubmittingProfile (for main button):", isSubmittingProfile); // Este isSubmittingProfile es el del envío final
    // console.log("formData.searchQuery?.trim() exists:", !!formData.searchQuery?.trim()); 
    // console.log("formData.businessCategoryId exists:", !!formData.businessCategoryId); 
    // console.log("formData.description?.trim() exists:", !!formData.description?.trim());   
    // console.log("-----------------------------");

    if (loadError) {
        return ( <p className="text-center text-sm text-critical dark:text-critical-light p-4 bg-red-50 dark:bg-red-800/20 rounded-md"> <Icon.WarningCircle size={24} className="inline mr-2" /> Could not load Google Places. Please check your API key or try refreshing. </p> );
    }
    if (!isLoaded) {
       return ( <div className="w-full bg-surface dark:bg-gray-700 px-4 py-3 rounded-lg border border-line dark:border-gray-600 flex items-center"> <Icon.CircleNotch className="animate-spin text-secondary dark:text-gray-400 mr-3 h-5 w-5" /> <span className="text-secondary dark:text-gray-400 text-sm">Loading search capabilities...</span> </div> );
    }

    const formElementVisualSharedClass = "w-full bg-surface dark:bg-gray-700 text-secondary dark:text-gray-300 px-4 py-3 rounded-lg border border-line dark:border-gray-600 focus:ring-2 focus:ring-blue focus:border-transparent transition-colors";
    const inputAntiAutoZoomClass = "caption11"; 

    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="businessSearch" className="block caption11 font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
            Enter Business Name *
          </label>
            <Autocomplete
              onLoad={onLoadAutocomplete}
              onPlaceChanged={onPlaceChanged}
              options={{ types: ['establishment'], fields: ['name', 'formatted_address', 'address_components', 'place_id', 'formatted_phone_number', 'website', 'geometry'] }}
            >
              <input
                id="businessSearch" type="text" value={formData.searchQuery || ''}
                onChange={handleSearchInputChange}
                placeholder="e.g., John's Pizzeria, Springfield" required
                className={`${formElementVisualSharedClass} ${inputAntiAutoZoomClass}`}
              />
            </Autocomplete>
          <p className="mt-1.5 text-xs caption11 text-gray-500 dark:text-gray-400">
            Start typing and select your business from the suggestions.
          </p>
        </div>

        {selectedNAP && (
          <div className="mt-4 p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 rounded-lg space-y-2">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center">
              <Icon.Info size={18} className="mr-2 flex-shrink-0" /> Google Information Found:
            </h3>
            {selectedNAP.name && <p className="text-xs caption11 text-gray-700 dark:text-gray-200"><strong>Name:</strong> {selectedNAP.name}</p>}
            {selectedNAP.address && <p className="text-xs caption11 text-gray-700 dark:text-gray-200"><strong>Address:</strong> {selectedNAP.address}</p>}
            {selectedNAP.phone && <p className="text-xs caption11 text-gray-700 dark:text-gray-200"><strong>Phone:</strong> {selectedNAP.phone}</p>}
            {selectedNAP.website && <p className="text-xs caption11 text-gray-700 dark:text-gray-200"><strong>Website:</strong> <a href={selectedNAP.website} target="_blank" rel="noopener noreferrer" className="text-blue dark:text-blue-400 hover:underline">{selectedNAP.website}</a></p>}
            {selectedNAP.googleCountryCode && (
              <p className="text-xs caption11 text-gray-700 dark:text-gray-200">
                <strong>Google Country Code:</strong> {selectedNAP.googleCountryCode}
                (Mapped to <strong>{mapCountryCodeToISO3(selectedNAP.googleCountryCode) || 'N/A'}</strong> for our system)
              </p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="businessCategoryComboboxInput" className="block caption11 font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
            Business Category *
          </label>
          <Combobox 
            value={businessCategories.find(cat => cat.id === (typeof formData.businessCategoryId === 'string' ? parseInt(formData.businessCategoryId) : formData.businessCategoryId)) || null}
            onChange={handleCategorySelected}
            disabled={isLoadingCategories || !formData.countryCode || formData.countryCode.length !== 3 || businessCategories.length === 0}
            name="businessCategoryId"
          >
            <div className="relative">
                <Combobox.Input
                  id="businessCategoryComboboxInput"
                  className={`${formElementVisualSharedClass} ${inputAntiAutoZoomClass} pr-10 disabled:opacity-50 disabled:cursor-not-allowed`}
                  displayValue={(category: BrightLocalCategory | null) => category?.name || ''}
                  onChange={(event) => {
                    setCategoryQuery(event.target.value);
                    if (event.target.value === '') { handleCategorySelected(null); }
                  }}
                  placeholder={
                    isLoadingCategories ? "Loading categories..." :
                    !formData.countryCode || formData.countryCode.length !== 3 ? "Valid 3-letter country code needed" :
                    businessCategories.length === 0 ? `No categories for ${formData.countryCode || 'country'}` :
                    "Type or select a category"
                  }
                  autoComplete="off"
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3 disabled:opacity-50"
                                 disabled={isLoadingCategories || !formData.countryCode || formData.countryCode.length !== 3 || businessCategories.length === 0}
                >
                  <Icon.CaretUpDown size={20} className="text-gray-400" aria-hidden="true" />
                </Combobox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none sm:text-sm">
                   {isLoadingCategories ? ( <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">Loading...</div>
                  ) : filteredCategories.length === 0 && categoryQuery !== '' ? ( <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300"> Nothing found for &quot;{categoryQuery}&quot;.</div>
                  ) : filteredCategories.length === 0 && categoryQuery === '' && businessCategories.length > 0 ? ( <div className="relative cursor-default select-none py-2 px-4 caption11 text-gray-500 dark:text-gray-400"> Type to search from {businessCategories.length} categories.</div>
                  ) : (
                    filteredCategories.map((category) => (
                      <Combobox.Option key={category.id} className={({ active }) => `relative caption11 cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue text-white dark:bg-blue-600' : 'text-gray-900 dark:text-gray-100'}`} value={category} >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{category.name}</span>
                            {selected ? (<span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue dark:text-blue-400'}`}><Icon.Check size={20} weight="bold" aria-hidden="true" /></span>) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
           {!isLoadingCategories && formData.countryCode && formData.countryCode.length === 3 && businessCategories.length === 0 && (
                <p className="mt-1.5 text-xs caption11 text-yellow-600 dark:text-yellow-400">No categories found for country: {formData.countryCode}. Location setup might be suboptimal.</p>
            )}
            {formData.countryCode && formData.countryCode.length !== 3 && (
                 <p className="mt-1.5 text-xs caption11 text-red-600 dark:text-red-400">A 3-letter country code (e.g., USA) is needed to load categories. Current: {formData.countryCode || "Not set"}</p>
            )}
        </div>

        <div>
            <label htmlFor="description" className="block caption11 font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                Business Description *
            </label>
            <textarea id="description" name="description" rows={3} value={formData.description || ''} onChange={handleInputChange}
                required placeholder="Briefly describe your business (max 500 characters)"
                className={`${formElementVisualSharedClass} ${inputAntiAutoZoomClass} h-auto`}
                maxLength={500}
            ></textarea>
        </div>

        <div className="pt-2">
          <button type="button" onClick={prepareForLocationSetup}
            disabled={!isLoaded || isLoadingCategories || isSubmittingProfile || !formData.searchQuery?.trim() || !formData.businessCategoryId || !formData.description?.trim() }
            className="button-main bg-blue hover:bg-dark-blue dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmittingProfile && submissionStatus === null ? (
                 <> <Icon.CircleNotch className="animate-spin mr-2 inline-block h-5 w-5" /> Processing...</>
            ) : (
                 <>Review & Initiate Setup <Icon.RocketLaunch size={20} weight="bold" className="inline-block ml-2" /></>
            )}
          </button>
        </div>

        {submissionStatus && (
            <div className={`mt-6 p-3 rounded-md text-sm ${
                submissionStatus.success
                ? 'bg-green-50 dark:bg-green-800/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600'
                : 'bg-red-50 dark:bg-red-800/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600'
            }`}>
                <Icon.Info size={18} weight="fill" className="inline mr-2" />
                {submissionStatus.message}
                {submissionStatus.success && submissionStatus.locationId && (
                    <span className="block mt-1 text-xs">Location ID from service: {submissionStatus.locationId}</span>
                )}
            </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header"><TopNavTwo /><MenuOne /></header>
        <main className="content py-10 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-10">
              <Icon.Buildings size={40} weight="duotone" className="text-blue dark:text-blue-400 mx-auto mb-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                Online Presence Audit
              </h1>
              <p className="body2 text-secondary dark:text-gray-300 max-w-lg mx-auto">
                Find your business, add key details, and initiate its setup with our location service.
              </p>
            </div>

            <div className="form-block bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl">
              <div className="heading text-left mb-6">
                <div className="heading5 text-black dark:text-white">Business Details for Location Setup</div>
                <div className="body2 text-secondary dark:text-gray-300 mt-1">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Use Google to find your business, then select a category and add a description.
                </div>
              </div>
              {error && !submissionStatus && (
                <div className="mb-4 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-sm text-critical dark:text-red-300 border border-red-200 dark:border-red-700/50">
                    <Icon.WarningCircle size={20} className="inline mr-2" />{error}
                </div>
              )}
              {renderStepOne()}
            </div>
             <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              This tool maps Google Places data to our location service's format.
            </p>
          </div>
        </main>
        <footer id="footer"><Footer /></footer>
      </div>

      {/* --- MODAL DE CONFIRMACIÓN --- */}
      <Transition appear show={isConfirmModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-white flex items-center"
                  >
                    <Icon.ShieldCheck size={24} weight="fill" className="mr-2 text-blue dark:text-blue-400" />
                    Confirm Data for Location Setup
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      Please review the data that will be sent. You can copy the cURL command for testing or your records.
                    </p>
                    {curlForConfirmation && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">cURL Command (for external service):</h4>
                            <pre className="p-3 bg-gray-100 dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-200 rounded-md overflow-x-auto whitespace-pre-wrap break-all max-h-60 border border-gray-200 dark:border-gray-700">
                                {curlForConfirmation}
                            </pre>
                            <button
                                type="button"
                                onClick={copyCurlToClipboard}
                                className="text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 py-1.5 px-3 rounded-md flex items-center active:bg-gray-400 dark:active:bg-gray-500 transition-colors"
                            >
                                <Icon.Copy size={14} className="mr-1.5" /> Copy cURL
                            </button>
                        </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0 space-y-reverse">
                    <button
                      type="button"
                      className="button-main bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 w-full sm:w-auto py-2.5"
                      onClick={closeModal}
                      disabled={isSubmittingProfile}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`button-main text-white w-full sm:w-auto py-2.5 ${isSubmittingProfile ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed' : 'bg-blue hover:bg-dark-blue dark:bg-blue-600 dark:hover:bg-blue-700'}`}
                      onClick={confirmAndSubmitProfile}
                      disabled={isSubmittingProfile}
                    >
                      {isSubmittingProfile ? (
                        <> <Icon.CircleNotch className="animate-spin mr-2 inline-block h-5 w-5" /> Processing... </>
                      ) : (
                        <>Confirm & Initiate Setup <Icon.RocketLaunch size={18} weight="bold" className="ml-2 inline-block" /></>
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}