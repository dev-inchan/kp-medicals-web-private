'use client';
import { useEffect } from 'react';

type Props = {
  x: number | null;
  y: number | null;
};

export default function NaverMap({ x, y }: Props) {
  useEffect(() => {
    if (x && y) {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_API_KEY}`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (!(window as any).naver) {
          return;
        }

        const mapOptions = {
          center: new (window as any).naver.maps.LatLng(y ?? 37.5665, x ?? 126.978), // 서울 중심 좌표
          zoom: 15,
        };

        const map = new (window as any).naver.maps.Map('map', mapOptions);
        // 마커 추가
        const marker = new (window as any).naver.maps.Marker({
          position: new (window as any).naver.maps.LatLng(y ?? 37.5665, x ?? 126.978),
          map: map,
        });
      };

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [x, y]);

  return (
    <div>
      <div id='map' style={{ width: '100%', height: '354px' }}></div>
    </div>
  );
}
