// next.config.mjs

/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true, // Opcional pero recomendado
  // Aquí puedes agregar otras configuraciones como imágenes, rewrites, headers, etc.
};

export default withAnalyzer(nextConfig);