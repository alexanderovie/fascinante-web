// src/lib/seoLocalService/client.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Asegúrate de que BRIGHTLOCAL_API_KEY esté en tus variables de entorno (.env.local)
// Ejemplo: BRIGHTLOCAL_API_KEY=tu_clave_api_aqui
const apiKey = process.env.BRIGHTLOCAL_API_KEY;
const brightLocalApiBaseUrl = 'https://api.brightlocal.com'; // Confirmar si hay un /v1 o similar en la base

if (!apiKey) {
  console.warn(
    'La variable de entorno BRIGHTLOCAL_API_KEY no está configurada. Las llamadas a la API de BrightLocal fallarán.'
  );
}

const brightLocalApiClient: AxiosInstance = axios.create({
  baseURL: brightLocalApiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para añadir la API key a cada solicitud
brightLocalApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    } else {
      // Podrías optar por lanzar un error aquí si la API key es absolutamente necesaria
      // y no quieres que la solicitud proceda sin ella.
      // Por ahora, el warning al inicio es la notificación.
    }
    return config;
  },
  (error) => {
    // Manejar errores de configuración de la solicitud
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas (opcional, pero útil para logging o transformación global)
brightLocalApiClient.interceptors.response.use(
  (response) => {
    // Cualquier código de estado que esté dentro del rango de 2xx hace que esta función se active
    // Puedes hacer algo con los datos de la respuesta aquí si es necesario
    return response;
  },
  (error) => {
    // Cualquier código de estado que esté fuera del rango de 2xx hace que esta función se active
    // Puedes hacer un manejo de errores global aquí
    if (error.response) {
      // La solicitud se hizo y el servidor respondió con un código de estado
      // que cae fuera del rango de 2xx
      console.error('Error en respuesta de BrightLocal API:', error.response.status, error.response.data);
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error('No se recibió respuesta de BrightLocal API:', error.request);
    } else {
      // Algo sucedió al configurar la solicitud que provocó un error
      console.error('Error al configurar la solicitud a BrightLocal API:', error.message);
    }
    return Promise.reject(error);
  }
);

export default brightLocalApiClient;