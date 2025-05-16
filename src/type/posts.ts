// src/types/posts.ts

// Define la estructura esperada del frontmatter de tus archivos Markdown
export interface PostFrontmatter {
  title: string;
  date: string; // Formato YYYY-MM-DD es recomendado
  slug: string; // El slug que generaste y guardaste con el script
  author?: string;
  category?: string;
  tags?: string[]; // Lista de etiquetas
  excerpt?: string; // Un resumen corto
  coverImage?: string; // Ruta a la imagen de portada, ej: /images/blog/mi-imagen.png
  subTitle?: string;
  projectClient?: string; // Ejemplo de campos que tenías en tu JSON
  projectLocation?: string;
  originalId?: number; // El ID original del JSON, por si lo necesitas
  // Añade cualquier otro campo de metadatos que necesites
}

// Define la estructura completa de un post, incluyendo su contenido HTML
export interface Post extends PostFrontmatter {
  contentHtml: string; // El contenido del post procesado a HTML
}

// Un tipo más simple para resúmenes de posts (usado en listas, posts recientes, etc.)
export interface PostSummary extends Pick<PostFrontmatter, 'title' | 'date' | 'slug' | 'excerpt' | 'coverImage' | 'category'> {
    frontmatter: any;
  // Puedes añadir más campos si los necesitas para el resumen
}