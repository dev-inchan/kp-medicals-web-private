export const getBaseUrl = () => {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? '/' // 개발 환경에서는 프록시된 경로 사용
      : process.env.NEXT_PUBLIC_URL; // 배포 환경에서는 실제 서버의 URL 사용

  return `${baseUrl}`;
};
