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
  console.log('keyword : ', keyword);

  // URLSearchParams를 사용해 필요한 파라미터를 동적으로 추가
  const urlParams = new URLSearchParams({
    department_id: String(department_id),
    start: String(start),
    limit: String(limit),
  });

  // keyword가 존재할 경우에만 파라미터로 추가
  if (keyword.trim()) {
    urlParams.append('keyword', keyword.trim());
  }

  const url = `${process.env.NEXT_PUBLIC_URL}api/medical-wallet/hospitals?${urlParams.toString()}`;

  console.log('url : ', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result: HospitalResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Network response was not ok');
  }

  console.log('병원검색결과:', result);
  return result;
};
