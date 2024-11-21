import {withSentryConfig, type SentryBuildOptions} from '@sentry/nextjs';
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plaid-merchant-logos.plaid.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    ppr: 'incremental',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['import-in-the-middle'],
  experimental: {
    turbo: {
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    },
  },
  webpack(config, {isServer}: {isServer: boolean}) {
    if (process.env.NODE_ENV === 'development' && !isServer) {
      // Enable source maps only in development mode for client-side
      config.devtool = 'source-map';
    }
    return config;
  },
};

// Sentry configuration
const sentryConfig: SentryBuildOptions = {
  org: 'amjarmed-dev',
  project: 'horizon-bank',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: '/monitoring',
};

// Combine Next.js config with Sentry
export default withSentryConfig(nextConfig, sentryConfig);

// Export the final configuration
