import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    tsconfigPath: path.resolve('./tsconfig.json'),
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias['@'] = path.resolve(dirname(fileURLToPath(import.meta.url)), 'src');
    return config;
  },
};

export default nextConfig;
