import type { NextConfig } from "next"

// Bundle-Analyse und Optimierung
export const bundleOptimization: Partial<NextConfig> = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react", "recharts", "date-fns"],
  },

  // Webpack-Optimierungen
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Tree shaking für bessere Bundle-Größe
      config.optimization.usedExports = true
      config.optimization.sideEffects = false

      // Chunk-Splitting für besseres Caching
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      }
    }

    return config
  },

  // Kompression aktivieren
  compress: true,

  // Bilder optimieren
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 Tage
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
