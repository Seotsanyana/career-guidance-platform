/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  turbopack: {
    rules: {
      '*.node': {
        as: '*.node',
        loaders: ['node-loader'],
      },
    },
  },
  webpack: (config, { isServer }) => {
    // Provide fallbacks for Node.js modules used by pdf-parse
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        url: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        zlib: false,
        querystring: false,
      }
    }

    return config
  },
}

export default nextConfig
