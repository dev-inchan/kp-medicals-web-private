import { HospitalResponse } from '@/types/hospital';

/**
 * 병원검색 요청 api
 */
export const getHospitals = async (keyword: string, start: number, limit: number): Promise<HospitalResponse> => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_URL +
      `api/medical-wallet/hospitals?keyword=${encodeURIComponent(keyword)}&start=${start}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const result: HospitalResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Network response was not ok');
  }

  return result;
};
