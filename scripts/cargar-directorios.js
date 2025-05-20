// scripts/cargar-directorios.js
require('dotenv').config();
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Configuración (asume que las variables de entorno están en .env)
const BRIGHTLOCAL_API_KEY = process.env.BRIGHTLOCAL_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!BRIGHTLOCAL_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing required environment variables. Please check your .env file for BRIGHTLOCAL_API_KEY, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BRIGHTLOCAL_DIRECTORIES_URL = 'https://api.brightlocal.com/data/v1/listings/directories';
const TABLE_NAME = 'brightlocal_directories';

async function fetchDirectoriesFromBrightLocal() {
    console.log(`Workspaceing all directories from ${BRIGHTLOCAL_DIRECTORIES_URL}...`);
    try {
        const response = await axios.get(BRIGHTLOCAL_DIRECTORIES_URL, {
            headers: {
                'Accept': 'application/json',
                'x-api-key': BRIGHTLOCAL_API_KEY,
            },
        });
        if (response.data && response.data.items) {
            console.log(`Successfully fetched ${response.data.items.length} directories.`);
            return response.data.items; // Array de objetos de directorio
        }
        console.log('No items found in BrightLocal directories response.');
        return [];
    } catch (error) {
        console.error('Error fetching directories from BrightLocal:', error.response ? error.response.data : error.message);
        return [];
    }
}

async function saveDirectoriesToSupabase(directories) {
    if (!directories || directories.length === 0) {
        console.log('No directories to save.');
        return;
    }

    const directoriesToInsert = directories.map(dir => ({
        id: dir.id, // Este es el ID de BrightLocal para el directorio
        name: dir.id, // Usamos el ID como nombre por ahora, se puede mejorar
        generic_url: dir.url,
        supported_countries: dir.countries,
        country_specific_urls: dir.urls, // Objeto JSON
        last_synced_at: new Date().toISOString(),
    }));

    console.log(`Attempting to insert/update ${directoriesToInsert.length} directories into Supabase table ${TABLE_NAME}...`);

    // Usamos upsert con 'onConflict' en 'id' (la PK)
    // Si el directorio ya existe, actualizamos la información y last_synced_at
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert(directoriesToInsert, {
            onConflict: 'id', // Asumiendo que 'id' es la PRIMARY KEY
            ignoreDuplicates: false // Queremos actualizar si ya existe
        });

    if (error) {
        console.error('Error saving directories to Supabase:', error.message);
        if (error.details) console.error("Error details:", error.details);
        if (error.hint) console.error("Error hint:", error.hint);
    } else {
        console.log(`Successfully processed directories. Supabase response data:`, data);
    }
}

async function main() {
    console.log('Starting script to populate BrightLocal directories...');
    const directories = await fetchDirectoriesFromBrightLocal();
    if (directories && directories.length > 0) {
        await saveDirectoriesToSupabase(directories);
    } else {
        console.log('No directories fetched, skipping Supabase save.');
    }
    console.log('\nScript finished.');
}

main().catch(error => {
    console.error("An error occurred in the main execution:", error);
});