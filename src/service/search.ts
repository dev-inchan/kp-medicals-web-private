import { HospitalResponse } from '@/types/hospital';
import { getBaseUrl } from '@/utils/api';
/**
 * 병원검색 요청 api
 */
export const getHospitals = async (
  keyword: string,
  department_id: number,
  start: number,
  limit: number,
): Promise<HospitalResponse> => {
  console.log('병원검색요청');
  const url = `${process.env.NEXT_PUBLIC_URL}api/medical-wallet/hospitals?department_id=${encodeURIComponent(department_id)}&keyword=${encodeURIComponent(keyword)}&start=${start}&limit=${limit}`;
  console.log('url : ', url);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}api/medical-wallet/hospitals?department_id=${encodeURIComponent(department_id)}&keyword=${encodeURIComponent(keyword)}&start=${start}&limit=${limit}`,
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
  console.log('병원검색결과:', result);
  return result;
};
