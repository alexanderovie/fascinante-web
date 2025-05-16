// src/lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // Para parsear el frontmatter
import { remark } from 'remark';
import html from 'remark-html'; // Para convertir markdown a HTML

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  // Agrega aquí cualquier otro dato del frontmatter que uses
  [key: string]: any;
}

export interface PostContent extends PostData {
  contentHtml: string;
}

export function getSortedPostsData(): PostData[] {
  // Obtener nombres de archivos bajo /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remover ".md" del nombre del archivo para obtener el slug
    const slug = fileName.replace(/\.md$/, '');

    // Leer el archivo markdown como string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Usar gray-matter para parsear la sección de metadatos del post
    const matterResult = matter(fileContents);

    // Combinar los datos con el slug
    return {
      slug,
      title: matterResult.data.title || 'Título no encontrado', // Valor por defecto
      date: matterResult.data.date || 'Fecha no encontrada',   // Valor por defecto
      ...matterResult.data,
    } as PostData;
  });

  // Ordenar posts por fecha
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  // Retorna un array como:
  // [
  //   { params: { slug: 'ssg-ssr' } },
  //   { params: { slug: 'pre-rendering' } }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<PostContent> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Usar gray-matter para parsear la sección de metadatos del post
  const matterResult = matter(fileContents);

  // Usar remark para convertir markdown a HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combinar los datos con el slug y contentHtml
  return {
    slug,
    contentHtml,
    title: matterResult.data.title || 'Título no encontrado',
    date: matterResult.data.date || 'Fecha no encontrada',
    ...matterResult.data,
  } as PostContent;
}