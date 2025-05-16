// convert-json-to-md.js
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const yaml = require('js-yaml');

// --- Configuración ---
const jsonFilePath = path.join(__dirname, 'src', 'data', 'blog.json'); // Ruta a tu JSON
const outputDir = path.join(__dirname, 'posts'); // Carpeta donde se guardarán los .md
// --------------------

// 1. Asegurar que el directorio de salida exista
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Directorio de salida creado: ${outputDir}`);
}

// 2. Leer y parsear el archivo JSON
let articlesData;
try {
    const jsonString = fs.readFileSync(jsonFilePath, 'utf8');
    articlesData = JSON.parse(jsonString);
} catch (err) {
    console.error(`Error al leer o parsear el archivo JSON (${jsonFilePath}):`, err);
    process.exit(1);
}

if (!Array.isArray(articlesData)) {
    console.error('El contenido del JSON no es un array. Se esperaba un array de artículos.');
    process.exit(1);
}

console.log(`Se encontraron ${articlesData.length} artículos en el JSON.`);

// 3. Procesar cada artículo y crear un archivo .md
articlesData.forEach(item => {
    if (!item.title) {
        console.warn(`Saltando item con id ${item.id} por no tener título.`);
        return;
    }

    const articleSlug = slugify(item.title, {
        lower: true,
        strict: true,
        trim: true
    });

    // Mapeo de campos JSON a Frontmatter YAML
    // ¡IMPORTANTE! Ajusta este mapeo según tus necesidades.
    const frontmatter = {
        title: item.title,
        date: item.projectInfo?.completedDate || new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        author: item.projectInfo?.manager || 'Fascinante Digital', // Autor por defecto
        category: item.category || 'General',
        excerpt: item.shortDesc || item.desc?.substring(0, 200) || '', // Extracto corto
        coverImage: item.img || '', // Asume que item.img es la imagen de portada
        slug: articleSlug, // Guardamos el slug generado para consistencia
        // Otros campos que quieras mantener del JSON:
        subTitle: item.subTitle || '',
        projectClient: item.projectInfo?.client || '',
        projectLocation: item.projectInfo?.location || '',
        originalId: item.id // Para referencia al ID original del JSON
    };

    // Construcción del Cuerpo del Markdown
    // Esta es la parte más personalizable. Debes decidir qué campos de tu JSON
    // formarán el contenido principal y cómo se estructurarán.
    let markdownBody = '';

    // Párrafo introductorio (usando item.desc si es apropiado)
    if (item.desc) {
        markdownBody += `${item.desc}\n\n`;
    }

    // Sección "Cómo lo hicimos"
    if (item.howWeDidItHeading && item.howWeDidItText) {
        markdownBody += `## <span class="math-inline">\{item\.howWeDidItHeading\}\\n\\n</span>{item.howWeDidItText}\n\n`;
    }

    // Lista de Características
    if (item.featuresList && item.featuresList.length > 0) {
        markdownBody += `### Características Clave\n`; // O el título que prefieras
        item.featuresList.forEach(feature => {
            markdownBody += `- ${feature}\n`;
        });
        markdownBody += '\n';
    }

    // Sección "Resultado Final"
    if (item.finalOutcomeHeading && item.finalOutcomeDesc) {
        markdownBody += `## <span class="math-inline">\{item\.finalOutcomeHeading\}\\n\\n</span>{item.finalOutcomeDesc}\n\n`;
    }

    // "Counts" o resultados clave
    if (item.counts && item.counts.length > 0) {
        markdownBody += `### Resultados Destacados\n`;
        item.counts.forEach(count => {
            markdownBody += `- **${count.label}:** ${count.value}\n`;
        });
        markdownBody += '\n';
    }

    // Imagen del resultado final (si existe)
    if (item.finalOutcomeImage) {
         markdownBody += `![Resultado Final](${item.finalOutcomeImage})\n`;
    }


    // Combinar frontmatter y cuerpo
    const frontmatterYaml = yaml.dump(frontmatter);
    const fullMarkdownContent = `---\n${frontmatterYaml}---\n\n${markdownBody.trim()}\n`;

    // Crear el archivo .md
    const fileName = `${articleSlug}.md`;
    const filePath = path.join(outputDir, fileName);

    try {
        fs.writeFileSync(filePath, fullMarkdownContent, 'utf8');
        console.log(`Creado: ${filePath}`);
    } catch (err) {
        console.error(`Error al escribir el archivo ${filePath}:`, err);
    }
});

console.log('Proceso de conversión a Markdown completado.');