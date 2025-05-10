// Define the type for a single content section within a blog post
interface ContentSection {
    type: string; // e.g., "paragraph", "heading", "image", "list", etc.
    text?: string; // For paragraphs, headings, captions
    level?: number; // For headings (h1, h2, h3, etc.)
    url?: string; // For images
    alt?: string; // Alt text for images
    caption?: string; // Caption for images
    style?: string; // For lists (e.g., "unordered", "ordered")
    items?: string[]; // Array of list items
    // Add other properties here as you define more content types (e.g., codeBlock, quote)
}

// Define the type for SEO metadata specific to a blog post
interface BlogSEO {
    title?: string; // Meta title for the page
    description?: string; // Meta description for the page
    // You might add more SEO fields like keywords, canonical URL, etc.
    // keywords?: string;
    // canonicalUrl?: string;
}

// Define the main type for a blog post, matching the expanded JSON structure
// Added 'desc' back as it's being used in the Breadcrumb
export interface BlogType {
    img: string | StaticImport;
    id: number; // Unique identifier
    slug: string; // URL-friendly identifier (e.g., "guia-completa-seo-local-2025")
    tag?: string; // Optional main tag (e.g., "seo", "design")
    category?: string; // Optional category (e.g., "local-listing", "web-design")
    mainImage?: string; // URL for the main featured image (replaces original 'img')
    title: string; // The main title of the blog post
    author?: string; // Optional author's name
    authorAvatar?: string; // Optional URL for the author's avatar image (replaces original 'avatar')
    date?: string; // Optional publication date (string format)
    readingTime?: string; // Optional estimated reading time (e.g., "8 min read")
    shortDescription?: string; // A concise summary, useful for list views and meta descriptions
    // Added 'desc' back to match usage in Breadcrumb, though shortDescription is preferred for lists/meta
    desc?: string; // Original description field, included for compatibility if still used elsewhere

    // This is the core of the detailed content
    contentSections?: ContentSection[];
    tags?: string[]; // Optional array of related tags or keywords
    seo?: BlogSEO; // Optional object for SEO metadata

    // Original fields that might still be present in JSON but ideally replaced by contentSections or mainImage
    // img?: string; // Consider migrating to mainImage
    // listImg?: string[]; // Consider migrating to contentSections with type "image"
    // avatar?: string; // Consider migrating to authorAvatar
}
