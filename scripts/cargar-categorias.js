// scripts/cargar-categorias.js
const dotenvResult = require('dotenv').config();

// --- Opcional: Logs de depuración de dotenv ---
// if (dotenvResult.error) {
//   console.error('Error al cargar .env:', dotenvResult.error);
// }
// console.log('Variables cargadas por dotenv:', dotenvResult.parsed);
// console.log('process.env.SUPABASE_URL (después de dotenv):', process.env.SUPABASE_URL);
// console.log('process.env.SUPABASE_SERVICE_ROLE_KEY (después de dotenv):', process.env.SUPABASE_SERVICE_ROLE_KEY);
// console.log('process.env.BRIGHTLOCAL_API_KEY (después de dotenv):', process.env.BRIGHTLOCAL_API_KEY);
// --- Fin de logs de depuración de dotenv ---

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// --- Configuración y asignación de constantes ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BRIGHTLOCAL_API_KEY = process.env.BRIGHTLOCAL_API_KEY;
// --- Fin de Configuración ---

// --- Verificación de que las constantes tienen valor ---
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !BRIGHTLOCAL_API_KEY) {
    console.error('¡ALERTA! Una o más variables de entorno requeridas son undefined después de intentar leerlas de process.env.');
    if (!SUPABASE_URL) console.error('SUPABASE_URL es undefined.');
    if (!SUPABASE_SERVICE_ROLE_KEY) console.error('SUPABASE_SERVICE_ROLE_KEY es undefined.');
    if (!BRIGHTLOCAL_API_KEY) console.error('BRIGHTLOCAL_API_KEY es undefined.');
    console.error('Asegúrate de que estas variables estén definidas en tu archivo .env y que dotenv las esté cargando correctamente.');
    process.exit(1); // Detiene el script si faltan variables críticas
}
// --- Fin de Verificación ---

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BRIGHTLOCAL_BASE_URL = 'https://api.brightlocal.com/manage/v1/business-categories';
const SUPPORTED_COUNTRIES = ['AUS', 'CAN', 'DEU', 'GBR', 'HKG', 'IRL', 'MAC', 'NLD', 'NZL', 'PHL', 'SGP', 'TWN', 'USA', 'ZAF'];
const TABLE_NAME = 'brightlocal_business_categories'; // Asegúrate que este sea el nombre correcto de tu tabla

async function fetchCategoriesFromBrightLocal(countryCode) {
    const url = `${BRIGHTLOCAL_BASE_URL}/${countryCode}`;
    console.log(`Workspaceing categories for ${countryCode} from ${url}...`);
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'x-api-key': BRIGHTLOCAL_API_KEY,
            },
        });
        if (response.data && response.data.items) {
            console.log(`Successfully fetched ${response.data.items.length} categories for ${countryCode}.`);
            return response.data.items; // Array de objetos { id, name }
        }
        console.log(`No items found for ${countryCode} in BrightLocal response.`);
        return [];
    } catch (error) {
        console.error(`Error fetching categories for ${countryCode}:`, error.response ? error.response.data : error.message);
        return [];
    }
}

async function saveCategoriesToSupabase(categories, countryCode) {
    if (!categories || categories.length === 0) {
        console.log(`No categories to save for ${countryCode}.`);
        return;
    }

    const categoriesToInsert = categories.map(category => ({
        id: category.id, // De la API de BrightLocal, se mapea a tu columna 'id'
        name: category.name, // De la API de BrightLocal
        country_code: countryCode,
        last_synced_at: new Date().toISOString(),
    }));

    console.log(`Attempting to insert/update ${categoriesToInsert.length} categories for ${countryCode} into Supabase table ${TABLE_NAME}...`);

    // Asumimos que la tabla tiene una PRIMARY KEY compuesta (id, country_code)
    // o una restricción UNIQUE(id, country_code) para que onConflict funcione correctamente.
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert(categoriesToInsert, {
            onConflict: 'id,country_code', // Columnas que forman tu restricción UNIQUE o PK
            ignoreDuplicates: true // Para ON CONFLICT DO NOTHING
        });

    if (error) {
        console.error(`Error saving categories for ${countryCode} to Supabase:`, error.message);
        if (error.details) console.error("Error details:", error.details);
        if (error.hint) console.error("Error hint:", error.hint);
    } else {
        // El objeto 'data' devuelto por upsert con ignoreDuplicates:true puede ser null o un array vacío
        // si todas las filas fueron ignoradas o si hubo un error no capturado de otra manera.
        // O puede contener las filas que SÍ se insertaron (si no todas eran duplicados).
        // La propiedad 'count' puede ser más fiable si está disponible y es precisa para este caso.
        console.log(`Successfully processed categories for ${countryCode}. Supabase response data:`, data);
    }
}

async function main() {
    console.log('Starting script to populate BrightLocal business categories...');

    // La verificación de variables ya se hizo arriba y el script saldría si faltan.

    for (const country of SUPPORTED_COUNTRIES) {
        console.log(`\nProcessing country: ${country}`);
        const categories = await fetchCategoriesFromBrightLocal(country);
        if (categories && categories.length > 0) {
            await saveCategoriesToSupabase(categories, country);
        } else {
            console.log(`No categories fetched for ${country}, skipping Supabase save.`);
        }
        // Pausa opcional para no saturar la API (si es necesario)
        // console.log(`Pausing for 1 second before next country...`);
        // await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo de pausa
    }

    console.log('\nScript finished.');
}

main().catch(error => {
    console.error("An error occurred in the main execution:", error);
});