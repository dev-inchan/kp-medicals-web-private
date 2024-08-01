/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    tsconfigPath: resolve('./tsconfig.json'),
  },
};

export default nextConfig;
