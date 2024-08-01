import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // TypeScript와 일치하는 경로 별칭 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias['@'] = path.resolve(dirname(fileURLToPath(import.meta.url)), 'src');
    return config;
  },
};

export default nextConfig;
