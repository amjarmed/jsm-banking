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
  // Warning: This allows production builds to successfully complete even if
  // your project has ESLint errors.
  eslint: {
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
  org: 'porfolio-0a',
  project: 'horizon-bank',
  // silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: false, // Can be used to suppress logs
};

// Combine Next.js config with Sentry
const config = withSentryConfig(nextConfig, sentryConfig);

// Export the final configuration
export default config;
