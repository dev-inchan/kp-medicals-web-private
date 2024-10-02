import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // TypeScript와 일치하는 경로 별칭 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.MOCK': JSON.stringify(dev), // 개발 모드에서만 mock 사용
      }),
    );

    return config;
  },
  async rewrites() {
    // 로컬 개발 환경에서만 프록시 적용
    // if (process.env.NODE_ENV === 'development') {
    //   return [
    //     {
    //       source: '/api/:path*', // 클라이언트가 접근하는 경로
    //       destination: 'https://localhost:80/api/:path*', // 프록시할 외부 서버
    //     },
    //   ];
    // }
    // 프로덕션 모드에서는 rewrites 사용 안 함
    return [];
  },
};

export default nextConfig;
