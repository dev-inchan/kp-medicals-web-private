import { HospitalDetailResponse } from '@/types/hospitalDetail';

type Props = {
  hospital_id: number;
};

export const getHospitalDetail = async (hospital_id: number): Promise<HospitalDetailResponse> => {
  const url = `${process.env.NEXT_PUBLIC_URL}api/medical-wallet/hospitals/detail?uid=uuid-mobile&hospital_id=${hospital_id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error : ${response.status} ${response.statusText}`);
    }

    const data: HospitalDetailResponse = await response.json();
    // console.log('병원상세 :', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);

    // 적절한 오류 처리 방법에 따라 빈 값을 반환하거나, 에러를 던질 수 있음
    throw error;
  }
};
