// Importa los componentes necesarios para la estructura de la página
import { Metadata } from "next";
import Link from "next/link";

// Define los metadatos para SEO
export const metadata: Metadata = {
  title: "Cookie Policy - Fascinante Digital",
  description: "Learn about our cookie usage and how we handle your data on Fascinante Digital.",
};

export default function CookiePolicy() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-8 lg:px-16">
      {/* Título principal */}
      <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>

      {/* Sección de introducción */}
      <p className="mb-6">
        This Cookie Policy explains how Fascinante Digital uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control their use.
      </p>

      {/* Sección de uso de cookies */}
      <h2 className="text-2xl font-semibold mb-4">Why We Use Cookies</h2>
      <p className="mb-6">
        We use cookies to improve your browsing experience, analyze site traffic, and understand how our site is being used. These cookies are essential for the functionality of our website and to provide a better user experience.
      </p>

      {/* Tipos de cookies */}
      <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
      <ul className="mb-6 list-disc list-inside">
        <li>Necessary Cookies</li>
        <li>Performance Cookies</li>
        <li>Functional Cookies</li>
        <li>Targeting Cookies</li>
      </ul>

      {/* Control de cookies */}
      <h2 className="text-2xl font-semibold mb-4">How to Control Cookies</h2>
      <p className="mb-6">
        You have the right to accept or reject cookies. You can manage your preferences through your browser settings. Note that disabling certain cookies may impact your experience on our site.
      </p>

      {/* Enlace a la política de privacidad */}
      <p className="mb-6">
        For more information, please review our{" "}
        <Link href="/privacy-policy" className="text-blue-600 underline">
          Privacy Policy
        </Link>
        .
      </p>

      {/* Conclusión */}
      <p className="mb-6">
        If you have any questions about this Cookie Policy, please contact us at{" "}
        <Link href="/contact" className="text-blue-600 underline">
          Contact Us
        </Link>
        .
      </p>

      {/* Última actualización */}
      <p className="text-sm text-gray-600">Last updated: May 2025</p>
    </div>
  );
}