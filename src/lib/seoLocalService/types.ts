// src/lib/seoLocalService/types.ts

// --- Tipos para la API de BrightLocal "Create Location" ---

export interface BrightLocalAddress {
  address1: string; // required
  address2?: string;
  region?: string; // Required for USA, GBR, CAN, AUS
  region_code?: string; // Example: NY
  city?: string;
  postcode?: string;
}

export interface BrightLocalUrls {
  website_url: string; // required
  menu_url?: string;
  reservation_url?: string;
  order_url?: string;
  gallery_url?: string;
  event_url?: string;
}

export interface BrightLocalContact {
  first_name?: string;
  last_name?: string;
  mobile?: string;
  telephone?: string;
  email?: string;
  fax?: string;
}

export interface BrightLocalOpeningHoursTime {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

export interface BrightLocalOpeningHoursDay {
  status: 'open' | 'closed' | 'split';
  hours?: BrightLocalOpeningHoursTime[];
}

export interface BrightLocalOpeningHoursRegular {
  apply_to_all?: boolean;
  monday?: BrightLocalOpeningHoursDay;
  tuesday?: BrightLocalOpeningHoursDay;
  wednesday?: BrightLocalOpeningHoursDay;
  thursday?: BrightLocalOpeningHoursDay;
  friday?: BrightLocalOpeningHoursDay;
  saturday?: BrightLocalOpeningHoursDay;
  sunday?: BrightLocalOpeningHoursDay;
}

export interface BrightLocalOpeningHoursSpecialDay {
  date: string;
  status: 'open' | 'closed' | 'split';
  hours?: BrightLocalOpeningHoursTime[];
}

export interface BrightLocalOpeningHoursSpecial {
  days?: BrightLocalOpeningHoursSpecialDay[];
}

export interface BrightLocalOpeningSchedule {
  regular?: BrightLocalOpeningHoursRegular;
  special?: BrightLocalOpeningHoursSpecial;
  reopen_date?: string; // "YYYY-MM-DD"
}

export interface BrightLocalGeoLocation {
  latitude: number;
  longitude: number;
}

export interface BrightLocalLicenseInfo {
  liquor_license_number?: string;
  tobacco_license_number?: string;
}

export interface BrightLocalImageItem {
  image_id: string;
  image_url: string;
  created_at: string; // "YYYY-MM-DD"
  description?: string;
  order?: number;
}

export interface BrightLocalLogo {
  image_id: string;
  image_url: string;
  created_at: string;
  description?: string;
}

export interface BrightLocalImages {
  logo?: BrightLocalLogo;
  photos?: BrightLocalImageItem[];
}

export interface BrightLocalSocialProfiles {
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string; // Formerly Twitter
  instagram_url?: string;
  pinterest_url?: string;
}

export interface BrightLocalWhiteLabelPublishedReports {
  lrt?: boolean;
  lsg?: boolean;
  ct?: boolean;
  cb?: boolean;
  rm?: boolean;
  gbp?: boolean;
  lsa?: boolean;
  ga?: boolean;
  facebook?: boolean;
}

export interface BrightLocalWhiteLabelSettings {
  white_label_url_enabled?: boolean;
  profile_id?: number | null | string;
  published_reports?: BrightLocalWhiteLabelPublishedReports;
}

// Payload para crear una ubicación en BrightLocal
export interface BrightLocalCreateLocationPayload {
  business_name: string;
  location_reference: string;
  country: string;
  address: BrightLocalAddress;
  telephone: string;
  business_category_id: number;
  description: string;
  urls: BrightLocalUrls;
  client_id?: number;
  contact?: BrightLocalContact;
  num_employees?: number;
  opening_hours?: BrightLocalOpeningSchedule;
  formation_date?: string;
  extra_business_category_ids?: number[];
  geo_location?: BrightLocalGeoLocation;
  payment_methods?: string[];
  services_or_products?: string[];
  licenses?: BrightLocalLicenseInfo;
  images?: BrightLocalImages;
  social_profiles?: BrightLocalSocialProfiles;
  timezone?: string;
  white_label_settings?: BrightLocalWhiteLabelSettings;
  is_service_area_business?: boolean;
  language?: string;
}

// Respuesta de BrightLocal al crear una ubicación
export interface BrightLocalCreateLocationResponse {
  location_id: number;
  success?: boolean;
  message?: string;
  [key: string]: any;
}


// --- Tipos para nuestra tabla Supabase `client_locations` ---
export interface ClientLocationSupabaseRow {
  id: string; // UUID
  client_id: string; // UUID, FK to agency_clients
  brightlocal_location_id?: number | null;
  brightlocal_location_reference?: string | null;
  brightlocal_internal_client_id?: number | null;
  business_name: string;
  description?: string | null;
  phone_number?: string | null;
  website_url?: string | null;
  brightlocal_business_category_id?: number | null;
  extra_business_category_ids?: number[] | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state_province?: string | null;
  region_code?: string | null;
  postal_code?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  additional_urls?: BrightLocalUrls | Record<string, string | undefined> | null; // JSONB
  contact_main_first_name?: string | null;
  contact_main_last_name?: string | null;
  contact_main_email?: string | null;
  contact_main_phone?: string | null;
  contact_main_mobile?: string | null;
  contact_main_fax?: string | null;
  number_of_employees?: number | null;
  opening_hours?: BrightLocalOpeningSchedule | null; // JSONB
  formation_date?: string | null; // "mm-yyyy"
  payment_methods?: string[] | null; // TEXT[]
  services_or_products?: string[] | null; // TEXT[]
  licenses_info?: BrightLocalLicenseInfo | null; // JSONB
  is_service_area_business?: boolean | null;
  social_profiles?: BrightLocalSocialProfiles | null; // JSONB
  images_data?: BrightLocalImages | null; // JSONB
  timezone?: string | null;
  language_code?: string | null;
  white_label_settings?: BrightLocalWhiteLabelSettings | null; // JSONB
  is_active: boolean;
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

// --- Tipos para la API de BrightLocal "Get Business Categories" --- (AÑADIDO)
export interface BrightLocalBusinessCategoryItem {
  id: number;
  name: string;
}

export interface BrightLocalGetBusinessCategoriesResponse {
  total_count: number; // Asegúrate de que se maneje como número post-fetch
  items: BrightLocalBusinessCategoryItem[];
  success?: boolean; // Para nuestro manejo interno
  message?: string;  // Para nuestro manejo interno
  [key: string]: any;
}

// --- Tipo para nuestra tabla Supabase `brightlocal_business_categories` --- (AÑADIDO)
export interface BrightLocalBusinessCategorySupabaseRow {
  id: number; // El ID de BrightLocal es la PK
  name: string;
  country_code: string;
  last_synced_at?: string | Date; // TIMESTAMPTZ
  created_at?: string | Date; // TIMESTAMPTZ
}