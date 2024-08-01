import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    tsconfigPath: path.resolve('./tsconfig.json'),
  },
};

export default nextConfig;
